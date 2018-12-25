import * as path from 'path';
import * as glob from 'glob';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import {range} from 'lodash';
import {IFixtureConfig} from './interface';

export class Loader {
    public files: string[] = [];
    public fixtures: any[] = [];
    public parameters: {[key: string]: any} = {};
    private stack: any[] = [];

    constructor(fixturesPath: string) {
        this.loadFixtures(fixturesPath);
    }

    private loadFixtures(fixturesPath: string) {
        this.files = glob.sync(path.resolve(path.join(fixturesPath, '*.{yml,yaml}')));
        const fixtures: any[] = [];

        for (const file of this.files) {
            const fixtureConfig: IFixtureConfig = yaml.safeLoad(fs.readFileSync(file).toString());

            // TODO: validate config

            const {items, parameters, entity, transformer} = fixtureConfig;

            for (const [referenceName, propertyList] of Object.entries(items)) {

            }

        }

        if (fixtures.parameters) {
            this.parameters = fixtures;

            delete fixtures.parameters;
        }

        this.fixtures = this.normalize(fixtures);
    }

    private normalize(fixtures: {[kay: string]: any}) {
        for (const [entityName, objects] of Object.entries(fixtures)) {
            for (const [referenceName, propertyList] of Object.entries(objects)) {
                const ff = /^([\w-_]+)\{(\d+)\.\.(\d+)\}$/g;

                if (ff.test(referenceName)) {
                    const result = ff.exec(referenceName);

                    if (result) {
                        for (const rangeNumber of range(+result[2], + result[3])) {
                            this.stack.push({
                                entity: entityName,
                                name: `${result[1]}${rangeNumber}`,
                                dependencies: this.findDependencies({...propertyList}),
                                data: {...propertyList},
                            });
                        }
                    }
                } else {
                    this.stack.push({
                        entity: entityName,
                        name: referenceName,
                        dependencies: this.findDependencies({...propertyList}),
                        data: {...propertyList},
                    });
                }
            }
        }

        return this.stack
            .map((s) => ({...s, dependencies: this.deepDependenciesResolver(s)}))
            .sort((a: any, b: any) => a.dependencies.length - b.dependencies.length)
        ;
    }

    findDependencies(propertyList: any[] | object): any[] {
        const dependencies = [];

        for (const value of Object.values(propertyList)) {
            if ( typeof value === 'string' &&  value.indexOf('@') === 0) {
                dependencies.push(value.substr(1));
            } else if (typeof value === 'object') {
                dependencies.push(...this.findDependencies(value));
            }
        }

        return dependencies;
    }

    deepDependenciesResolver(item: any) {
        const dependencies: any[] = [];

        for (const dependencyName of item.dependencies) {
            const dependencyElement = this.stack.find(s => s.name === dependencyName);

            if (!dependencyElement) {
                if (dependencyName.substr(dependencyName.length - 1) !== '*') {
                    throw new Error(`Reference "${dependencyName}" not found`);
                }

                const prefix = dependencyName.substr(0, dependencyName.length - 1);
                const regex = new RegExp(`^${prefix}([0-9]+)$`);

                for (const dependencyMaskElement of this.stack.filter(s => regex.test(s.name))) {
                    dependencies.push(dependencyMaskElement.name, ...this.deepDependenciesResolver(dependencyMaskElement));
                }
            } else {
                dependencies.push(dependencyName, ...this.deepDependenciesResolver(dependencyElement));
            }

        }

        return dependencies
            .filter((value: any, index: number, self: any[]) => self.indexOf(value) === index)
        ;
    }
}
