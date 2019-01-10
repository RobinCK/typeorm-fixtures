import * as ejs from 'ejs';
import { IFixture, IParser } from '../interface';

export class EjsParser implements IParser {
    /**
     * @type {number}
     */
    public priority = 80;

    /**
     * @type {RegExp}
     */
    private get regExp() {
        return /<%(.+?)%>/gm;
    }

    /**
     * @param {string} value
     * @return {boolean}
     */
    isSupport(value: string): boolean {
        return this.regExp.test(value);
    }

    /**
     * @param {string} value
     * @param {IFixture} fixture
     * @return {any}
     */
    parse(value: string, fixture: IFixture): any {
        return ejs.render(value, fixture);
    }
}
