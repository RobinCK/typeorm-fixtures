#!/usr/bin/env node

import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import * as chalk from 'chalk';
import * as cliProgress from 'cli-progress';
import * as resolveFrom from 'resolve-from';
import { Command } from 'commander';
import { CommandUtils } from 'typeorm/commands/CommandUtils';
import { DataSource } from 'typeorm';

import { Loader } from './Loader';
import { fixturesIterator } from './util';
import { Resolver } from './Resolver';
import { Builder } from './Builder';
import { Parser } from './Parser';

const error = (message: string) => {
    console.log(chalk.red(message)); // eslint-disable-line
};
const debug = (message: string) => {
    if (options.debug) {
        console.log(chalk.grey(message)); // eslint-disable-line
    }
};

const command = new Command();
command
    .version(require('../package.json').version, '-v, --version')
    .usage('[options] <paths> Fixtures folder/file path')
    .arguments('<path...>')
    .option('--require <require...>', 'A list of additional modules. e.g. ts-node/register')
    .option('-d, --dataSource <dataSource>', 'TypeORM dataSource path', 'dataSource.ts')
    .option('-s, --sync', 'Database schema sync')
    .option('--debug', 'Enable debug')
    .option('--no-color', 'Disable color')
    .parse();

const paths = command.args;
const options = command.opts();

if (!paths) {
    error('Path to fixtureConfigs folder is not passed.\n');
    command.outputHelp();
    process.exit(1);
}

const dataSourcePath = path.resolve(options.dataSource);

if (!fs.existsSync(dataSourcePath)) {
    throw new Error(`TypeOrm config ${dataSourcePath} not found`);
}

if (options.require) {
    for (const req of options.require) {
        require(resolveFrom.silent(process.cwd(), req) || req);
    }
}

async function main(): Promise<void> {
    let dataSource: DataSource | undefined = undefined;

    try {
        debug('Connection to database...');
        dataSource = await CommandUtils.loadDataSource(dataSourcePath);
        await dataSource.initialize();

        if (options.sync) {
            debug('Synchronize database schema');
            await dataSource.synchronize(true);
        }

        debug('Loading fixtureConfigs');
        const loader = new Loader();
        paths.forEach((fixturePath: string) => {
            loader.load(path.resolve(fixturePath));
        });

        debug('Resolving fixtureConfigs');
        const resolver = new Resolver();
        const fixtures = resolver.resolve(loader.fixtureConfigs);
        const builder = new Builder(dataSource, new Parser());

        const bar = new cliProgress.Bar({
            format: `${chalk.yellow('Progress')}  ${chalk.green('[{bar}]')} ${chalk.yellow(
                '{percentage}% | ETA: {eta}s | {value}/{total} {name}',
            )} `,
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            fps: 5,
            stream: process.stdout,
            barsize: 50,
        });

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

        debug('Database disconnect');
        await dataSource.destroy();
        process.exit(0);
    } catch (err: any) {
        error('Fail fixture loading: ' + err.message);
        if (dataSource) {
            await dataSource.destroy();
        }
        console.log(err); // eslint-disable-line
        process.exit(1);
    }
}

main().then(() => null);
