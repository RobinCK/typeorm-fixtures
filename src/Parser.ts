import * as parsers from './parsers';
import { IDataParser, IFixture, IParser } from './interface';

export class Parser implements IDataParser {
    private parsers: IParser[] = [];

    constructor() {
        for (const parser of Object.values(parsers)) {
            this.parsers.push(new (parser as any)());
        }
    }

    /**
     * @param {object | any} data
     * @param {IFixture} fixture
     * @param entities
     * @return {any}
     */
    parse(data: object | any, fixture: IFixture, entities: any): any {
        const entityRawData = data instanceof Array ? [...data] : { ...data };

        for (const [key, value] of Object.entries(entityRawData)) {
            /* istanbul ignore else */
            if (typeof value === 'string') {
                for (const parser of this.parsers.sort((a, b) => b.priority - a.priority)) {
                    if (parser.isSupport(value)) {
                        entityRawData[key] = parser.parse(value, fixture, entities);
                    }
                }
                
                // Process escape sequences
                if (typeof entityRawData[key] === 'string') {
                    entityRawData[key] = this.processEscapes(entityRawData[key]);
                }
            }

            /* istanbul ignore else */
            if (typeof value === 'object') {
                entityRawData[key] = this.parse(value, fixture, entities);
            }
        }

        return entityRawData;
    }
    
    /**
     * Process `%` escape sequence. Currently used to escape curly braces to
     * prevent `faker` interpolation.
     *
     * For example:
     *
     * ```
     * // Faker interpolation
     * {{name.firstName}} === 'John'
     *
     * // Escape curly braces, no faker interpolation
     * %{%name.firstName%}%} === '%{%{name.firstName%}%}'
     *
     * // Escape %
     * %%{{name.firstName}}%% === '%John%'
     * ```
     *
     * @param {string} value
     */
    public processEscapes(value: string) {
        let state = 'unescaped';
        let unescapedValue = '';

        for (const ch of value) {
            switch (state) {
                case 'unescaped':
                    switch (ch) {
                        case '%':
                            state = 'escaped';
                            break;
                        default:
                            unescapedValue += ch;
                    }
                    break;
                case 'escaped':
                    switch (ch) {
                        case '{':
                        case '}':
                            unescapedValue += ch;
                            break;
                        case '%':
                            unescapedValue += '%';
                            break;
                        default:
                            throw new Error(`Invalid escape sequence: "%${ch}"`);
                    }
                    state = 'unescaped';
                    break;
            }
        }

        return unescapedValue;
    }
}
