#!/usr/bin/env node

import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';
import * as commander from 'commander';
import * as resolveFrom from 'resolve-from';
import * as yargsParser from 'yargs-parser';
import * as chalk from 'chalk';

import { Loader } from './Loader';
import { createConnection, fixturesIterator } from './util';
import { Resolver } from './Resolver';
import { getConnection } from 'typeorm';
import { Builder } from './Builder';
import { Parser } from './Parser';

commander
    .version(require('../package.json').version, '-v, --version')
    .usage('[options] <path> Fixtures folder/file path')
    .arguments('<path> [otherPaths...]')
    .action((fixturesPath: string, otherPaths: Array<string>, options) => {
        options.paths = [fixturesPath, ...otherPaths];
    })
    .option('--require <package>', 'A list of additional modules. e.g. ts-node/register')
    .option('-c, --config <path>', 'TypeORM config path', 'ormconfig.yml')
    .option('-cn, --connection [value]', 'TypeORM connection name', 'default')
    .option('-s --sync', 'Database schema sync')
    .option('-d --debug', 'Enable debug')
    .option('--no-color', 'Disable color');

commander.parse(process.argv);

const argv = yargsParser(process.argv.slice(2));

if (argv.require) {
    const requires = Array.isArray(argv.require) ? argv.require : [argv.require];

    for (const req of requires) {
        require(resolveFrom.silent(process.cwd(), req) || req);
    }
}

if (!commander.paths) {
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
        commander.paths.forEach((fixturePath: string) => {
            loader.load(path.resolve(fixturePath));
        });
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
            barsize: 50,
        });

        bar.start(fixtures.length, 0, { name: '' });

        for (const fixture of fixturesIterator(fixtures)) {
            const entity: any = await builder.build(fixture);

            try {
                bar.increment(1, { name: fixture.name });
                await connection.getRepository(fixture.entity).save(entity);
            } catch (e) {
                bar.stop();

                throw e;
            }
        }

        bar.update(fixtures.length, { name: '' });
        bar.stop();

        debug('\nDatabase disconnect');
        await connection.close();
        process.exit(0);
    })
    .catch(async e => {
        error('Fail fixture loading: ' + e.message);
        await getConnection().close();
        console.log(e); // tslint:disable-line
        process.exit(1);
    });
