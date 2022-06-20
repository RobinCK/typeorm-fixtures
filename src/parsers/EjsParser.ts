import * as ejs from 'ejs';
import { IFixture, IParser } from '../interface';

export class EjsParser implements IParser {
    /**
     * @type {number}
     */
    public priority = 80;

    isSupport(value: string): boolean {
        return /<%(.+?)%>/gms.test(value);
    }

    parse(value: string, fixture: IFixture): any {
        return ejs.render(value, fixture);
    }
}
