import * as path from 'path';
import * as fs from 'fs';
import { IFixturesConfig, ILoader } from '../interface';

export class JsonLoader implements ILoader {
    public extensionSupport = ['.json'];

    isSupport(filePath: string): boolean {
        return this.extensionSupport.includes(path.extname(filePath));
    }

    load(filePath: string): IFixturesConfig {
        return JSON.parse(fs.readFileSync(filePath).toString());
    }
}
