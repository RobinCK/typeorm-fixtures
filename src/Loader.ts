import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
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
        let files: string[] = [];

        if (fs.lstatSync(fixturesPath).isFile()) {
            if (!this.loaders.find(l => l.isSupport(fixturesPath))) {
                throw new Error(`File extension "${path.extname(fixturesPath)}" not support`);
            }

            files = [fixturesPath];
        } else {
            files = glob.sync(path.resolve(path.join(fixturesPath, `*.{${extensions}}`)));
        }

        for (const file of files) {
            const loader = this.loaders.find(l => l.isSupport(file));

            /* istanbul ignore else */
            if (loader) {
                const fixtureConfig: IFixturesConfig = loader.load(file);
                const { error } = jFixturesSchema.validate(fixtureConfig);

                if (error) {
                    throw new Error(`Invalid fixtures config. File "${file}"`);
                }

                /* istanbul ignore else */
                if (fixtureConfig.processor) {
                    fixtureConfig.processor = path.isAbsolute(fixtureConfig.processor)
                        ? path.resolve(fixtureConfig.processor)
                        : path.resolve(path.dirname(file), fixtureConfig.processor);
                }

                this.fixtureConfigs.push(fixtureConfig);
            }
        }
    }
}
