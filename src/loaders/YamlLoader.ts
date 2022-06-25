import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { IFixturesConfig, ILoader } from '../interface';

export class YamlLoader implements ILoader {
    public extensionSupport = ['.yaml', '.yml'];

    isSupport(filePath: string): boolean {
        return this.extensionSupport.includes(path.extname(filePath));
    }

    load(filePath: string): IFixturesConfig {
        return yaml.load(fs.readFileSync(filePath).toString()) as IFixturesConfig;
    }
}
