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
     * @param {object | null | any} data
     * @param {IFixture} fixture
     * @param entities
     * @return {any}
     */
    parse(data: object | null | any, fixture: IFixture, entities: any): any {
        if (data === null) {
            return null;
        }

        const entityRawData = data instanceof Array ? [...data] : { ...data };

        for (const [key, value] of Object.entries(entityRawData)) {
            /* istanbul ignore else */
            if (typeof value === 'string') {
                for (const parser of this.parsers.sort((a, b) => b.priority - a.priority)) {
                    if (parser.isSupport(value)) {
                        entityRawData[key] = parser.parse(value, fixture, entities);
                    }
                }
            }

            /* istanbul ignore else */
            if (typeof value === 'object') {
                entityRawData[key] = this.parse(value, fixture, entities);
            }
        }

        return entityRawData;
    }
}
