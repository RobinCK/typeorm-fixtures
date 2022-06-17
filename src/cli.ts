#!/usr/bin/env node

import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import * as chalk from 'chalk';
import * as cliProgress from 'cli-progress';
import * as resolveFrom from 'resolve-from';
import { Command } from 'commander';

import { Loader } from './Loader';
import { createConnection, fixturesIterator } from './util';
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
    .arguments('<path...>')
    .option('--require <require...>', 'A list of additional modules. e.g. ts-node/register')
    .option('-c, --dataSource <dataSource>', 'TypeORM dataSource path', 'dataSource.ts')
    .option('-cn, --connection <connection>', 'TypeORM connection name', 'default')
    .option('-s --sync', 'Database schema sync')
    .option('-d --debug', 'Enable debug')
    .option('--no-color', 'Disable color')
    .parse();

const paths = command.args;
const options = command.opts();

if (!paths) {
    error('Path to fixtureConfigs folder is not passed.\n');
    command.outputHelp();
    process.exit(1);
}

const typeOrmConfigPath = path.resolve(options.dataSource);

if (!fs.existsSync(typeOrmConfigPath)) {
    throw new Error(`TypeOrm config ${typeOrmConfigPath} not found`);
}

if (options.require) {
    for (const req of options.require) {
        require(resolveFrom.silent(process.cwd(), req) || req);
    }
}

debug('Connection to database...');
createConnection(
    {
        root: path.dirname(typeOrmConfigPath),
        configName: path.basename(typeOrmConfigPath, path.extname(typeOrmConfigPath)),
    },
    options.connection,
)
    .then(async (dataSource) => {
        debug('Database is connected');

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

        debug('\nDatabase disconnect');
        await dataSource.destroy();
        process.exit(0);
    })
    .catch(async (e) => {
        error('Fail fixture loading: ' + e.message);
        console.log(e); // eslint-disable-line
        process.exit(1);
    });
