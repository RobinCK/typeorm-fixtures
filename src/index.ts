import 'reflect-metadata';
import * as path from 'path';
import {range, sum, random} from 'lodash';
import * as fs from 'fs';
import * as glob from 'glob';
import * as yaml from 'js-yaml';
import {createConnection, getConnection} from 'typeorm';

const files = glob.sync(path.join(process.cwd(), 'fixtures/*.{yml,yaml}'));
const fixtures = {};

for (const file of files) {
    const fixture = yaml.safeLoad(fs.readFileSync(file).toString());
    Object.assign(fixtures, fixture);
}

const findDependencies = (propertyList: any[] | object): any[] => {
    const dependencies = [];

    for (const value of Object.values(propertyList)) {
        if ( typeof value === 'string' &&  value.indexOf('@') === 0) {
            dependencies.push(value.substr(1));
        } else if (typeof value === 'object') {
            dependencies.push(...findDependencies(value));
        }
    }

    return dependencies;
};

function deepDependenciesResolver(item: any) {
    const dependencies: any[] = [];

    for (const dependencyName of item.dependencies) {
        const dependencyElement = stack.find(s => s.name === dependencyName);

        if (!dependencyElement) {
            if (dependencyName.substr(dependencyName.length - 1) !== '*') {
                throw new Error(`Reference "${dependencyName}" not found`);
            }

            const prefix = dependencyName.substr(0, dependencyName.length - 1);
            const regex = new RegExp(`^${prefix}([0-9]+)$`);

            for (const dependencyMaskElement of stack.filter(s => regex.test(s.name))) {
                dependencies.push(dependencyMaskElement.name, ...deepDependenciesResolver(dependencyMaskElement));
            }
        } else {
            dependencies.push(dependencyName, ...deepDependenciesResolver(dependencyElement));
        }

    }

    return dependencies
        .filter((value: any, index: number, self: any[]) => self.indexOf(value) === index)
    ;
}

const stack: any[] = [];

for (const [entityName, objects] of Object.entries(fixtures)) {
    for (const [referenceName, propertyList] of Object.entries(objects)) {
        if (/^([\w-_]+)\{(\d+)\.\.(\d+)\}$/g.test(referenceName)) {
            const result = /^([\w-_]+)\{(\d+)\.\.(\d+)\}$/g.exec(referenceName);

            if (result) {
                for (const rangeNumber of range(+result[2], + result[3])) {
                    stack.push({
                        entity: entityName,
                        name: `${result[1]}${rangeNumber}`,
                        dependencies: findDependencies({...propertyList}),
                        data: {...propertyList},
                    });
                }
            }
        } else {
            stack.push({
                entity: entityName,
                name: referenceName,
                dependencies: findDependencies({...propertyList}),
                data: {...propertyList},
            });
        }
    }
}

const sorted = stack
    .map((s) => {
        s.dependencies = deepDependenciesResolver(s);

        return s;
    })
    .sort((a: any, b: any) => a.dependencies.length - b.dependencies.length)
;

const addedList: any = {};

let f = sorted.find((l) =>
        sum(l.dependencies.map((d: string) => addedList[d] !== undefined ? 1 : 0)) === l.dependencies.length
            &&
        !addedList[l.name]
);

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
    while (!!f) {
        const repository = getConnection().getRepository(f.entity);
        const entity = repository.create();
        Object.assign(entity, buildEntity(f.data));

        addedList[f.name] = entity;
        console.log(entity);

        f = sorted.find((l) =>
            sum(l.dependencies.map((d: string) => addedList[d] !== undefined ? 1 : 0)) === l.dependencies.length
            &&
            !addedList[l.name]
        );
    }

    await connection.close();
});

