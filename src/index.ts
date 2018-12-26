import 'reflect-metadata';
import * as path from 'path';
import {createConnection, getConnection} from 'typeorm';

import {Loader} from './Loader';

const loader = new Loader(path.resolve('fixtures'));


// function buildEntity(data: any) {
//     for (const [key, value] of Object.entries(data)) {
//         if ( typeof value === 'string' &&  value.indexOf('@') === 0) {
//             if (value.substr(value.length - 1) === '*') {
//                 const prefix = value.substr(1, value.length - 1);
//                 const regex = new RegExp(`^${prefix}([0-9]+)$`);
//
//                 const maskEntities = Object.keys(addedList).filter((s: string) => regex.test(s));
//                 data[key] = addedList[maskEntities[random(maskEntities.length - 1)]];
//             } else {
//                 data[key] = addedList[value.substr(1)];
//             }
//         } else if (typeof value === 'object') {
//             data[key] = buildEntity(value);
//         } else if (typeof value === 'string') {
//             // TODO: Check faker function and replace value
//         }
//     }
//
//     return data;
// }
//
// createConnection().then(async (connection) => {
//     while (!!f) {
//         const repository = getConnection().getRepository(f.entity);
//         const entity = repository.create();
//         Object.assign(entity, buildEntity(f.data));
//
//         addedList[f.name] = entity;
//
//         f = sorted.find((l) =>
//             sum(l.dependencies.map((d: string) => addedList[d] !== undefined ? 1 : 0)) === l.dependencies.length
//             &&
//             !addedList[l.name]
//         );
//     }
//
//     await connection.close();
// });

