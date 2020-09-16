import * as faker from 'faker';
import { IFixture, IParser } from '../interface';

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
     * @param {IFixture} fixture
     * @return {any}
     */
    parse(value: string, fixture?: IFixture): any {
        if (fixture?.locale) {
            // @ts-ignore
            faker.locale = fixture.locale;
        }
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
