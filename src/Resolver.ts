import { range, sample } from 'lodash';

import { IFixture, IFixturesConfig } from './interface';

export class Resolver {
    private stack: IFixture[] = [];

    /**
     * @param fixtureConfigs
     * @return {IFixture[]}
     */
    resolve(fixtureConfigs: IFixturesConfig[]): IFixture[] {
        for (const { entity, items, parameters, processor } of fixtureConfigs) {
            for (const [mainReferenceName, propertyList] of Object.entries(items)) {
                const rangeRegExp = /^([\w-_]+)\{(\d+)\.\.(\d+)\}$/gm;
                let referenceNames: string[] = [];

                if (rangeRegExp.test(mainReferenceName)) {
                    const result = mainReferenceName.split(rangeRegExp);

                    /* istanbul ignore else */
                    if (result) {
                        referenceNames = range(+result[2], +(+result[3]) + 1).map(
                            rangeNumber => `${result[1]}${rangeNumber}`,
                        );
                    }
                } else {
                    referenceNames = [mainReferenceName];
                }

                for (const name of referenceNames) {
                    const data = { ...propertyList };

                    this.stack.push({
                        parameters: parameters || {},
                        processor,
                        entity: entity,
                        name: name,
                        data,
                        dependencies: this.resolveDependencies(name, data),
                    });
                }
            }
        }

        return this.stack
            .map(s => ({ ...s, dependencies: this.resolveDeepDependencies(s) }))
            .sort((a: any, b: any) => a.dependencies.length - b.dependencies.length);
    }

    /**
     * @param {string} parentReferenceName
     * @param {any[] | object} propertyList
     * @return {any[]}
     */
    private resolveDependencies(parentReferenceName: string, propertyList: any): any[] {
        const dependencies = [];
        const currentRegExp = /\(\$current((\+|\-|\/|\*)\d+)?\)/g;

        for (const [key, value] of Object.entries(propertyList)) {
            if (typeof value === 'string' && value.indexOf('@') === 0) {
                const reference = this.resolveReference(parentReferenceName, value.substr(1));

                propertyList[key] = `@${reference}`;
                dependencies.push(reference);
            } else if (typeof value === 'string' && currentRegExp.test(value)) {
                propertyList[key] = value.replace(currentRegExp, this.resolveCurrent(parentReferenceName, value));
            } else if (typeof value === 'object' && value !== null) {
                dependencies.push(...this.resolveDependencies(parentReferenceName, value));
            }
        }

        return dependencies;
    }

    /**
     * @param {string} fixtureIdentify
     * @param {string} reference
     * @return {any}
     */
    private resolveReference(fixtureIdentify: string, reference: string) {
        const currentRegExp = /^([\w-_]+)\(\$current((\+|\-|\/|\*)\d+)?\)$/gm;
        const rangeRegExp = /^([\w-_]+)\{(\d+)\.\.(\d+)\}$/gm;

        if (currentRegExp.test(reference)) {
            const index = this.resolveCurrent(fixtureIdentify, reference);
            /* istanbul ignore else */
            if (!index) {
                throw new Error(
                    `Error parsed index in reference: "${reference}" and fixture identify: ${fixtureIdentify}`,
                );
            }

            return reference.replace(/\(\$current((\+|\-|\/|\*)\d+)?\)/g, index);
        } else if (rangeRegExp.test(reference)) {
            const splitting = reference.split(rangeRegExp);
            sample(range(+splitting[2], +(+splitting[3]) + 1));

            return `${splitting[1]}${sample(range(+splitting[2], +(+splitting[3]) + 1))}`;
        }

        return reference;
    }

    /**
     * @param {string} fixtureIdentify
     * @param {string} value
     */
    private resolveCurrent(fixtureIdentify: string, value: string): any {
        const currentIndexRegExp = /^[a-z\_\-]+(\d+)$/gi;
        const currentRegExp = /\(\$current((\+|\-|\/|\*)\d+)\)/gi;
        const splitting = fixtureIdentify.split(currentIndexRegExp);
        if (currentRegExp.test(value)) {
            const calc = String(value.match(/(\+|\-|\/|\*)\d+/gi));

            return eval(splitting[1].concat(calc));
        }

        return splitting[1];
    }

    /**
     * @param item
     * @return {any[]}
     */
    private resolveDeepDependencies(item: any) {
        const dependencies: any[] = [];

        for (const dependencyName of item.dependencies) {
            const dependencyElement = this.stack.find(s => s.name === dependencyName);

            if (!dependencyElement) {
                /* istanbul ignore else */
                if (dependencyName.substr(dependencyName.length - 1) !== '*') {
                    throw new Error(`Reference "${dependencyName}" not found`);
                }

                const prefix = dependencyName.substr(0, dependencyName.length - 1);
                const regex = new RegExp(`^${prefix}([0-9]+)$`);

                for (const dependencyMaskElement of this.stack.filter(s => regex.test(s.name))) {
                    dependencies.push(
                        dependencyMaskElement.name,
                        ...this.resolveDeepDependencies(dependencyMaskElement),
                    );
                }
            } else {
                dependencies.push(dependencyName, ...this.resolveDeepDependencies(dependencyElement));
            }
        }

        return dependencies.filter((value: any, index: number, self: any[]) => self.indexOf(value) === index);
    }
}
