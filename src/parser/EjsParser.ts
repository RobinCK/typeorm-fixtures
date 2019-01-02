import * as ejs from 'ejs';
import { IFixture, IParser } from '../interface';

export class EjsParser implements IParser {
    public priority = 80;
    private regExp = /<%(.+?)%>/gm;

    isSupport(value: string): boolean {
        return this.regExp.test(value);
    }

    parse(value: string, fixture: IFixture): any {
        return ejs.render(value, fixture);
    }
}
