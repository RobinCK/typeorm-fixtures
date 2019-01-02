import * as path from 'path';
import * as glob from 'glob';
import * as yaml from 'js-yaml';
import * as Joi from 'joi';
import * as fs from 'fs';
import { range, sample } from 'lodash';
import { IFixture, IFixturesConfig } from './interface';
import { jFixturesSchema } from './schema';

export class Loader {
    public fixtures: IFixture[] = [];
    private stack: IFixture[] = [];

    /**
     * @param {string} fixturesPath
     */
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
            const { error } = Joi.validate(fixtureConfig, jFixturesSchema);

            if (error) {
                throw new Error(`Invalid fixtures config. File "${file}"`);
            }

            fixtures.push(fixtureConfig);
        }

        this.fixtures = this.normalize(fixtures);
    }

    /**
     * @param fixtures
     * @return {IFixture[]}
     */
    private normalize(fixtures: { [kay: string]: any }[]): IFixture[] {
        for (const { entity, items, parameters, processor } of fixtures) {
            for (const [mainReferenceName, propertyList] of Object.entries(items)) {
                const rangeRegExp = /^([\w-_]+)\{(\d+)\.\.(\d+)\}$/gm;
                let referenceNames: string[] = [];

                if (rangeRegExp.test(mainReferenceName)) {
                    const result = mainReferenceName.split(rangeRegExp);

                    if (result) {
                        referenceNames = range(+result[2], +(+result[3]) + 1)
                            .map(rangeNumber => `${result[1]}${rangeNumber}`)
                        ;
                    }
                } else {
                    referenceNames = [mainReferenceName];
                }

                for (const name of referenceNames) {
                    this.stack.push({
                        parameters: parameters || {},
                        processor,
                        entity: entity,
                        name: name,
                        dependencies: this.findDependencies(mainReferenceName, propertyList),
                        data: propertyList,
                    });
                }
            }
        }

        return this.stack
            .map(s => ({ ...s, dependencies: this.deepDependenciesResolver(s) }))
            .sort((a: any, b: any) => a.dependencies.length - b.dependencies.length);
    }

    /**
     * @param {string} parentReferenceName
     * @param {any[] | object} propertyList
     * @return {any[]}
     */
    findDependencies(parentReferenceName: string, propertyList: any): any[] {
        const dependencies = [];

        for (const [key, value] of Object.entries(propertyList)) {
            if (typeof value === 'string' && value.indexOf('@') === 0) {
                const reference = this.parseReference(parentReferenceName, value.substr(1));

                propertyList[key] = `@${reference}`;
                dependencies.push(reference);
            } else if (typeof value === 'object') {
                dependencies.push(...this.findDependencies(parentReferenceName, value));
            }
        }

        return dependencies;
    }

    /**
     * @param {string} parentReferenceName
     * @param {string} reference
     * @return {any}
     */
    private parseReference(parentReferenceName: string, reference: string) {
        const currentRegExp = /^([\w-_]+)\(\$current\)$/gm;
        const rangeRegExp = /^([\w-_]+)\{(\d+)\.\.(\d+)\}$/gm;

        if (currentRegExp.test(reference)) {
            const currentIndexRegExp = /^[a-z\_\-]+(\d+)$/gi;
            const splitting = parentReferenceName.split(currentIndexRegExp);
            const index = splitting[1] || '';

            return reference.replace('($current)', index);
        } else if (rangeRegExp.test(reference)) {
            const splitting = reference.split(rangeRegExp);
            sample(range(+splitting[2], +(+splitting[3]) + 1));

            return `${splitting[1]}${sample(range(+splitting[2], +(+splitting[3]) + 1))}`;
        }

        return reference;
    }

    /**
     * @param item
     * @return {any[]}
     */
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
                    dependencies.push(
                        dependencyMaskElement.name,
                        ...this.deepDependenciesResolver(dependencyMaskElement),
                    );
                }
            } else {
                dependencies.push(dependencyName, ...this.deepDependenciesResolver(dependencyElement));
            }
        }

        return dependencies.filter((value: any, index: number, self: any[]) => self.indexOf(value) === index);
    }
}
