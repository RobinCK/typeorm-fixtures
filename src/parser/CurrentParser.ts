import { IFixture, IParser } from '../interface';

export class CurrentParser implements IParser {
    public priority = 90;
    private regExp = /<\(\$current\)>/gm;
    public static currentIndexRegExp = /^[a-z\_\-]+(\d+)$/gi;

    isSupport(value: string): boolean {
        return this.regExp.test(value);
    }

    parse(value: string, fixture: IFixture): any {
        return value.split(this.regExp).join(this.getCurrentIndex(fixture.name));
    }

    private getCurrentIndex(name: string): string {
        const splitting = name.split(CurrentParser.currentIndexRegExp);

        return splitting[1] || '';
    }
}
