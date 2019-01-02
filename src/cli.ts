#!/usr/bin/env node

import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import * as commander from 'commander';

import { Loader } from './Loader';
import { createConnection, fixturesIterator } from './util';
import { Resolver } from './Resolver';

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

createConnection(
    {
        root: path.dirname(typeOrmConfigPath),
        configName: path.basename(typeOrmConfigPath, path.extname(typeOrmConfigPath)),
    },
    commander.connection,
).then(async connection => {
    const loader = new Loader(path.resolve(commander.path));
    const resolver = new Resolver(connection);

    for (const fixture of fixturesIterator(loader.fixtures)) {
        const entity = resolver.resolve(fixture);
    }

    await connection.close();
});
