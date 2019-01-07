import * as path from 'path';
import * as glob from 'glob';
import * as Joi from 'joi';
import * as loaders from './loaders';
import { IFixturesConfig, ILoader } from './interface';
import { jFixturesSchema } from './schema';

export class Loader {
    public fixtureConfigs: IFixturesConfig[] = [];
    private loaders: ILoader[] = [];

    constructor() {
        for (const loader of Object.values(loaders)) {
            this.loaders.push(new (loader as any)());
        }
    }

    /**
     * @param {string} fixturesPath
     */
    load(fixturesPath: string): void {
        const extensions = this.loaders.map(l => l.extensionSupport.map(e => e.substr(1)).join(',')).join(',');
        const files = glob.sync(path.resolve(path.join(fixturesPath, `*.{${extensions}}`)));

        for (const file of files) {
            const loader = this.loaders.find(l => l.isSupport(file));

            if (loader) {
                const fixtureConfig: IFixturesConfig = loader.load(file);
                const { error } = Joi.validate(fixtureConfig, jFixturesSchema);

                if (error) {
                    throw new Error(`Invalid fixtures config. File "${file}"`);
                }

                this.fixtureConfigs.push(fixtureConfig);
            }
        }
    }
}
