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
    public command = 'load <paths...>';
    public describe = 'Load fixtures.';

    private withDebug = false;

    builder(args: yargs.Argv) {
        return args
            .positional('paths', {
                demandOption: true,
                describe: 'Fixtures folder/file paths.',
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
        const withDebug = args.debug as boolean;

        for (const req of args.require as string[]) {
            require(resolveFrom.silent(process.cwd(), req) || req);
        }

        const dataSourcePath = path.resolve(args.dataSource as string);
        if (!fs.existsSync(dataSourcePath)) {
            throw new Error(`TypeOrm config ${dataSourcePath} not found`);
        }

        let dataSource: DataSource | undefined = undefined;
        try {
            if (withDebug) {
                console.log(chalk.grey('Connection to database...')); // eslint-disable-line
            }
            dataSource = await CommandUtils.loadDataSource(dataSourcePath);
            await dataSource.initialize();

            if (args.sync) {
                if (withDebug) {
                    console.log(chalk.grey('Synchronize database schema')); // eslint-disable-line
                }
                await dataSource.synchronize(true);
            }

            if (withDebug) {
                console.log(chalk.grey('Loading fixtureConfigs')); // eslint-disable-line
            }
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

            if (withDebug) {
                console.log(chalk.grey('Resolving fixtureConfigs')); // eslint-disable-line
            }
            const resolver = new Resolver();
            const fixtures = resolver.resolve(loader.fixtureConfigs);
            const builder = new Builder(dataSource, new Parser(), args.ignoreDecorators as boolean);

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

            if (withDebug) {
                console.log(chalk.grey('Database disconnect')); // eslint-disable-line
            }
            await dataSource.destroy();
            process.exit(0);
        } catch (err: any) {
            console.log(chalk.red('Fail fixture loading: ' + err.message)); // eslint-disable-line

            if (dataSource) {
                await dataSource.destroy();
            }
            process.exit(1);
        }
    }
}
