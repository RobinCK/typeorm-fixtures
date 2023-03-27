import * as path from 'path';
import { IFixturesConfig, ILoader } from '../interface';

export class TsLoader implements ILoader {
    public extensionSupport = ['.ts'];

    isSupport(filePath: string): boolean {
        return this.extensionSupport.includes(path.extname(filePath));
    }

    load(filePath: string): IFixturesConfig {
        return JSON.parse(JSON.stringify(require(filePath).default as IFixturesConfig));
    }
}
