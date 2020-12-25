import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { IFixturesConfig, ILoader } from '../interface';

export class YamlLoader implements ILoader {
    public extensionSupport = ['.yaml', '.yml'];

    /**
     * @param {string} filePath
     * @return {boolean}
     */
    isSupport(filePath: string): boolean {
        return this.extensionSupport.includes(path.extname(filePath));
    }

    /**
     * @param {string} filePath
     * @return {IFixturesConfig}
     */
    load(filePath: string): IFixturesConfig {
        return yaml.safeLoad(fs.readFileSync(filePath).toString()) as IFixturesConfig;
    }
}
