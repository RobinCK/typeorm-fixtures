import { IFixture } from './IFixture';

export interface IParser {
    priority: number;

    isSupport(value: string): boolean;
    parse(value: string, fixture: IFixture, entities: any): any;
}
