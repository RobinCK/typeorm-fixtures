import { IFixturesConfig } from './IFixturesConfig';

export interface ILoader {
    extensionSupport: string[];
    isSupport(filePath: string): boolean;
    load(filePath: string): IFixturesConfig;
}
