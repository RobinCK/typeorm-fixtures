import 'reflect-metadata';
import * as path from 'path';
import {random} from 'lodash';
import {createConnection, getConnection} from 'typeorm';

import {Loader} from './Loader';
import {fixturesIterator} from './util';

const addedList: any = {};

function buildEntity(data: any) {
    for (const [key, value] of Object.entries(data)) {
        if ( typeof value === 'string' &&  value.indexOf('@') === 0) {
            if (value.substr(value.length - 1) === '*') {
                const prefix = value.substr(1, value.length - 1);
                const regex = new RegExp(`^${prefix}([0-9]+)$`);

                const maskEntities = Object.keys(addedList).filter((s: string) => regex.test(s));
                data[key] = addedList[maskEntities[random(maskEntities.length - 1)]];
            } else {
                data[key] = addedList[value.substr(1)];
            }
        } else if (typeof value === 'object') {
            data[key] = buildEntity(value);
        } else if (typeof value === 'string') {
            // TODO: Check faker function and replace value
        }
    }

    return data;
}

createConnection().then(async (connection) => {
    const loader = new Loader(path.resolve('fixtures'));

    for (const value of fixturesIterator(loader.fixtures)) {
        console.log(value);
    }

    // console.log(makeFixture().next().value);
    // console.log(makeFixture().next().value);
    // console.log(makeFixture().next().value);

    // let obj = loader.fixtures.find((l) =>
    //     sum(l.dependencies.map((d: string) => addedList[d] !== undefined ? 1 : 0)) === l.dependencies.length
    //     &&
    //     !addedList[l.name]
    // );
    //
    // while (!!obj) {
    //     const repository = getConnection().getRepository(obj.entity);
    //     const entity = repository.create();
    //     Object.assign(entity, buildEntity(obj.data));
    //
    //     addedList[obj.name] = entity;
    //
    //     obj = loader.fixtures.find((l) =>
    //         sum(l.dependencies.map((d: string) => addedList[d] !== undefined ? 1 : 0)) === l.dependencies.length
    //         &&
    //         !addedList[l.name]
    //     );
    // }

    await connection.close();
});

