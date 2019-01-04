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
        return faker.fake(value);
    }
}
