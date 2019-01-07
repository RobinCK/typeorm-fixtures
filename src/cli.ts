#!/usr/bin/env node

import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';
import * as commander from 'commander';
import chalk from 'chalk';

import { Loader } from './Loader';
import { createConnection, fixturesIterator } from './util';
import { Resolver } from './Resolver';
import { getConnection, getRepository } from 'typeorm';
import { Builder } from './Builder';
import { Parser } from './Parser';

commander
    .version(require('../package.json').version, '-v, --version')
    .usage('[options] <path> Fixtures folder/file path')
    .arguments('<path>')
    .action((fixturesPath: string, options) => {
        options.path = fixturesPath;
    })
    .option('-c, --config <path>', 'TypeORM config path', 'ormconfig.yml')
    .option('-cn, --connection [value]', 'TypeORM connection name', 'default')
    .option('-s --sync', 'Database schema sync')
    .option('-d --debug', 'Enable debug')
    .option('--no-color', 'Disable color');

commander.parse(process.argv);

if (!commander.path) {
    console.error('Path to fixtureConfigs folder is not passed.\n');
    commander.outputHelp();
    process.exit(1);
}

const debug = (message: string) => {
    if (commander.debug) {
        console.log(chalk.grey(message)); // tslint:disable-line
    }
};

const error = (message: string) => {
    console.log(chalk.red(message)); // tslint:disable-line
};

const typeOrmConfigPath = path.resolve(commander.config);

if (!fs.existsSync(typeOrmConfigPath)) {
    throw new Error(`TypeOrm config ${typeOrmConfigPath} not found`);
}

debug('Connection to database...');

createConnection(
    {
        root: path.dirname(typeOrmConfigPath),
        configName: path.basename(typeOrmConfigPath, path.extname(typeOrmConfigPath)),
    },
    commander.connection,
)
    .then(async connection => {
        debug('Database is connected');

        if (commander.sync) {
            debug('Synchronize database schema');
            await connection.synchronize(true);
        }

        debug('Loading fixtureConfigs');
        const loader = new Loader();
        loader.load(path.resolve(commander.path));

        debug('Resolving fixtureConfigs');
        const resolver = new Resolver();
        const fixtures = resolver.resolve(loader.fixtureConfigs);
        const builder = new Builder(connection, new Parser());

        const bar = new cliProgress.Bar({
            format: `${chalk.yellow('Progress')}  ${chalk.green('[{bar}]')} ${chalk.yellow(
                '{percentage}% | ETA: {eta}s | {value}/{total} {name}',
            )} `,
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            fps: 5,
            stream: process.stdout,
            barsize: loader.fixtureConfigs.length,
        });

        bar.start(loader.fixtureConfigs.length, 0, { name: '' });

        for (const fixture of fixturesIterator(fixtures)) {
            const entity = builder.build(fixture);

            try {
                bar.increment(1, { name: fixture.name });
                await getRepository(entity.constructor.name).save(entity);
            } catch (e) {
                bar.stop();

                throw e;
            }
        }

        bar.update(loader.fixtureConfigs.length, { name: '' });
        bar.stop();

        debug('\nDatabase disconnect');
        await connection.close();
    })
    .catch(async e => {
        error('Fail fixture loading: ' + e.message);
        debug(e.query || e);
        await getConnection().close();
        process.exit(1);
    });
