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

const log = console.log; // tslint:disable-line

commander
    .version(require('../package.json').version, '-v, --version')
    .usage('[options] <path> Fixtures folder path')
    .arguments('<path>')
    .action((fixturesPath: string, options) => {
        options.path = fixturesPath;
    })
    .option('-c, --config <path>', 'TypeORM config path', 'ormconfig.yml')
    .option('-cn, --connection [value]', 'TypeORM connection name', 'default')
    .option('--no-color', 'Disable color');

commander.parse(process.argv);

if (!commander.path) {
    console.error('Path to fixtures folder is not passed.\n');
    commander.outputHelp();
    process.exit(1);
}

const typeOrmConfigPath = path.resolve(commander.config);

if (!fs.existsSync(typeOrmConfigPath)) {
    throw new Error(`TypeOrm config ${typeOrmConfigPath} not found`);
}

log(chalk.yellow('Connection to database...'));

createConnection(
    {
        root: path.dirname(typeOrmConfigPath),
        configName: path.basename(typeOrmConfigPath, path.extname(typeOrmConfigPath)),
    },
    commander.connection,
)
    .then(async connection => {
        log(chalk.green('Database is connected'));

        log(chalk.yellow('Loading fixtures'));
        const loader = new Loader(path.resolve(commander.path));
        log(chalk.yellow('Resolving fixtures'));
        const resolver = new Resolver(connection);

        const bar = new cliProgress.Bar({
            format: `${chalk.yellow('Progress')}  ${chalk.green('[{bar}]')} ${chalk.yellow(
                '{percentage}% | ETA: {eta}s | {value}/{total}',
            )} `,
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            fps: 5,
            stopOnComplete: true,
            stream: process.stdout,
            barsize: loader.fixtures.length,
        });

        bar.start(loader.fixtures.length, 0);

        for (const fixture of fixturesIterator(loader.fixtures)) {
            const entity = resolver.resolve(fixture);

            try {
                await getRepository(fixture.entity).save(entity);
                bar.increment(1);
            } catch (e) {
                bar.stop();
                throw e;
            }
        }

        log(chalk.yellow('Database disconnect'));
        await connection.close();
    })
    .catch(async e => {
        log(chalk.red('Fail fixtures loading: ' + e.message));
        await getConnection().close();
    });
