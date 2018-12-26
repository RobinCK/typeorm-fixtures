import * as path from 'path';
import * as glob from 'glob';
import * as yaml from 'js-yaml';
import * as Joi from 'joi';
import * as fs from 'fs';
import {range} from 'lodash';
import {IFixture, IFixturesConfig} from './interface';
import {jFixturesSchema} from './schema';

export class Loader {
    public fixtures: IFixture[] = [];
    private stack: IFixture[] = [];

    constructor(fixturesPath: string) {
        this.loadFixtures(fixturesPath);
    }

    /**
     * @param {string} fixturesPath
     */
    private loadFixtures(fixturesPath: string) {
        const files = glob.sync(path.resolve(path.join(fixturesPath, '*.{yml,yaml}')));
        const fixtures: IFixturesConfig[] = [];

        for (const file of files) {
            const fixtureConfig: IFixturesConfig = yaml.safeLoad(fs.readFileSync(file).toString());
            const {error} = Joi.validate(fixtureConfig, jFixturesSchema);

            if (error) {
                throw new Error(`Invalid fixtures config. File "${file}"`);
            }

            fixtures.push(fixtureConfig);
        }

        this.fixtures = this.normalize(fixtures);
    }

    private normalize(fixtures: {[kay: string]: any}[]) {
        for (const {entity, items, parameters, transformer } of fixtures) {
            for (const [referenceName, propertyList] of Object.entries(items)) {
                const ff = /^([\w-_]+)\{(\d+)\.\.(\d+)\}$/g;

                if (ff.test(referenceName)) {
                    const result = ff.exec(referenceName);

                    if (result) {
                        for (const rangeNumber of range(+result[2], + result[3])) {
                            this.stack.push({
                                parameters: parameters || {},
                                transformer,
                                entity: entity,
                                name: `${result[1]}${rangeNumber}`,
                                dependencies: this.findDependencies({...propertyList}),
                                data: {...propertyList},
                            });
                        }
                    }
                } else {
                    this.stack.push({
                        parameters: parameters || {},
                        transformer,
                        entity: entity,
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
