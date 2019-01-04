import { chunk, get } from 'lodash';
import { IFixture, IParser } from '../interface';

export class ParameterParser implements IParser {
    /**
     * @type {number}
     */
    public priority = 60;

    /**
     * @type {RegExp}
     */
    private regExp = /<\{(.+?)\}>/gm;

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
        const chunks: string[][] = chunk(value.split(this.regExp), 2);
        const result = [];

        for (const [str, parameter] of chunks) {
            result.push(str);

            if (parameter) {
                const parameterValue = get(fixture.parameters, parameter);

                if (parameterValue === undefined) {
                    throw new Error(`Unknown parameter "${parameter}" in ${fixture.name}`);
                }

                result.push(parameterValue);
            }
        }

        return result.join('');
    }
}
