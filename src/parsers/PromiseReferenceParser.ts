import { random } from 'lodash';
import { IParser, IFixture } from '../interface';

export class PromiseReferenceParser implements IParser {
    /**
     * @type {number}
     */
    public priority = 50;

    /**
     * @param {string} value
     * @return {boolean}
     */
    isSupport(value: string): boolean {
        return value.indexOf('resolve(@') === 0;
    }

    /**
     * @param {string} value
     * @param {IFixture} fixture
     * @param entities
     * @return {any}
     */
    parse(value: string, fixture: IFixture, entities: any): any {
        let result;
        const ref = value.substr(value.lastIndexOf('(') + 1);
        const reference = ref.substr(0, ref.length - 1);

        if (reference.substr(reference.length - 1) === '*') {
            const prefix = reference.substr(1, reference.length - 1);
            const regex = new RegExp(`^${prefix}([0-9]+)$`);
            const maskEntities = Object.keys(entities).filter((s: string) => regex.test(s));
            result = entities[maskEntities[random(maskEntities.length - 1)]];
        } else {
            result = entities[reference.substr(1)];
        }

        if (!result) {
            throw new Error(`Reference "${reference}" not found`);
        }

        return result;
    }
}
