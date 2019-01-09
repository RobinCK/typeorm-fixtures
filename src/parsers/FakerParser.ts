import * as faker from 'faker';
import { IParser } from '../interface';

export class FakerParser implements IParser {
    /**
     * @type {number}
     */
    public priority = 70;

    /**
     * @param {string} value
     * @return {boolean}
     */
    isSupport(value: string): boolean {
        return /\{\{.+\}\}/gm.test(value);
    }

    /**
     * @param {string} value
     * @return {any}
     */
    parse(value: string): any {
        const result = faker.fake(value);

        if ((+result).toString() === result) {
            return +result;
        } else if (result === 'true' || result === 'false') {
            return result === 'true';
        } else {
            return result;
        }
    }
}
