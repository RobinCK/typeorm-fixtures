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

commander
    .version(require('../package.json').version, '-v, --version')
    .usage('[options] <path> Fixtures folder path')
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
    console.error('Path to fixtures folder is not passed.\n');
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

const log = (message: string) => {
    console.log(chalk.green(message)); // tslint:disable-line
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

        debug('Loading fixtures');
        const loader = new Loader(path.resolve(commander.path));

        debug('Resolving fixtures');
        const resolver = new Resolver(connection);

        const bar = new cliProgress.Bar({
            format: `${chalk.yellow('Progress')}  ${chalk.green('[{bar}]')} ${chalk.yellow(
                '{percentage}% | ETA: {eta}s | {value}/{total} {name}',
            )} `,
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            fps: 5,
            stream: process.stdout,
            barsize: loader.fixtures.length,
        });

        bar.start(loader.fixtures.length, 0, { name: '' });

        for (const fixture of fixturesIterator(loader.fixtures)) {
            const entity = resolver.resolve(fixture);

            try {
                bar.increment(1, { name: fixture.name });
                await getRepository(entity.constructor.name).save(entity);
            } catch (e) {
                bar.stop();

                throw e;
            }
        }

        bar.update(loader.fixtures.length, { name: '' });
        bar.stop();

        debug('\nDatabase disconnect');
        await connection.close();
    })
    .catch(async e => {
        error('Fail fixtures loading: ' + e.message);
        debug(e.query || e);
        await getConnection().close();
        process.exit(1);
    });
