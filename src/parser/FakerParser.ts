import * as faker from 'faker';
import { IParser } from '../interface';

export class FakerParser implements IParser {
    public priority = 70;

    isSupport(value: string): boolean {
        return /\{\{.+\}\}/gm.test(value);
    }

    parse(value: string): any {
        return faker.fake(value);
    }
}
