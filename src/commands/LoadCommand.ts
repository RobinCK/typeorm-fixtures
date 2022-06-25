#!/usr/bin/env node

import 'reflect-metadata';
import * as chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';
import * as resolveFrom from 'resolve-from';
import * as yargs from 'yargs';
import { CommandUtils } from 'typeorm/commands/CommandUtils';
import { DataSource } from 'typeorm';

import { Builder } from '../Builder';
import { fixturesIterator } from '../util';
import { Loader } from '../Loader';
import { Parser } from '../Parser';
import { Resolver } from '../Resolver';

export class LoadCommand implements yargs.CommandModule {
    public command = 'load';
    public describe = 'Load fixtures.';

    private withDebug = false;

    private debug(message: string) {
        if (this.withDebug) {
            console.log(chalk.grey(message)); // eslint-disable-line
        }
    }

    private error(message: string) {
        console.log(chalk.red(message)); // eslint-disable-line
    }

    builder(args: yargs.Argv) {
        return args
            .positional('paths', {
                demandOption: true,
                describe: 'Fixtures folder/file path.',
            })
            .option('dataSource', {
                alias: 'd',
                default: 'dataSource.ts',
                demandOption: true,
                describe: 'Path to the file where your DataSource instance is defined.',
                string: true, // eslint-disable-line id-denylist
            })
            .option('require', {
                array: true,
                default: [],
                describe: 'A list of additional modules. e.g. ts-node/register.',
                string: true, // eslint-disable-line id-denylist
            })
            .option('ignoreDecorators', {
                boolean: true, // eslint-disable-line id-denylist
                default: false,
                describe: 'Set the option "ignoreDecorator" of class-transformer.',
            })
            .option('sync', {
                boolean: true, // eslint-disable-line id-denylist
                default: false,
                describe: 'Database schema sync.',
            })
            .boolean('debug')
            .boolean('color')
            .default({
                debug: false,
                color: true,
            });
    }

    async handler(args: yargs.Arguments): Promise<void> {
        this.withDebug = args.debug as boolean;

        for (const req of args.require as string[]) {
            require(resolveFrom.silent(process.cwd(), req) || req);
        }

        const dataSourcePath = path.resolve(args.dataSource as string);
        if (!fs.existsSync(dataSourcePath)) {
            throw new Error(`TypeOrm config ${dataSourcePath} not found`);
        }

        let dataSource: DataSource | undefined = undefined;
        try {
            this.debug('Connection to database...');
            dataSource = await CommandUtils.loadDataSource(dataSourcePath);
            await dataSource.initialize();

            if (args.sync) {
                this.debug('Synchronize database schema');
                await dataSource.synchronize(true);
            }

            this.debug('Loading fixtureConfigs');
            const loader = new Loader();
            (args.paths as string[]).forEach((fixturePath: string) => {
                loader.load(path.resolve(fixturePath));
            });

            const bar = new cliProgress.Bar({
                format: `${chalk.yellow('Progress')} ${chalk.green('[{bar}]')} ${chalk.yellow(
                    '{percentage}% | ETA: {eta}s | {value}/{total} {name}',
                )} `,
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
                fps: 5,
                stream: process.stdout,
                barsize: 50,
            });

            this.debug('Resolving fixtureConfigs');
            const resolver = new Resolver();
            const fixtures = resolver.resolve(loader.fixtureConfigs);
            const builder = new Builder(dataSource, new Parser());

            bar.start(fixtures.length, 0, { name: '' });

            for (const fixture of fixturesIterator(fixtures)) {
                const entity: any = await builder.build(fixture);

                try {
                    bar.increment(1, { name: fixture.name });
                    await dataSource.getRepository(fixture.entity).save(entity);
                } catch (e) {
                    bar.stop();
                    throw e;
                }
            }

            bar.update(fixtures.length, { name: '' });
            bar.stop();

            this.debug('Database disconnect');
            await dataSource.destroy();
            process.exit(0);
        } catch (err: any) {
            this.error('Fail fixture loading: ' + err.message);
            if (dataSource) {
                await dataSource.destroy();
            }
            console.log(err); // eslint-disable-line
            process.exit(1);
        }
    }
}
