import { IFixture } from './IFixture';

export interface IDataParser {
    parse(data: object | any, fixture: IFixture, entities: any): any;
}
