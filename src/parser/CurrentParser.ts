import { IFixture, IParser } from '../interface';

export class CurrentParser implements IParser {
    /**
     * @type {number}
     */
    public priority = 90;

    /**
     * @type {RegExp}
     */
    private regExp = /<\(\$current\)>/gm;

    /**
     * @type {RegExp}
     */
    public static currentIndexRegExp = /^[a-z\_\-]+(\d+)$/gi;

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
        return value.split(this.regExp).join(this.getCurrentIndex(fixture.name));
    }

    /**
     * @param {string} name
     * @return {string}
     */
    private getCurrentIndex(name: string): string {
        const splitting = name.split(CurrentParser.currentIndexRegExp);

        return splitting[1] || '';
    }
}
