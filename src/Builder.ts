import * as fs from 'fs';
import * as path from 'path';
import { Connection } from 'typeorm';
import { IDataParser, IFixture } from './interface';

export class Builder {
    public entities: any = {};

    constructor(private readonly connection: Connection, private readonly parser: IDataParser) {}

    /**
     * @param {IFixture} fixture
     * @return {any}
     */
    build(fixture: IFixture) {
        const repository = this.connection.getRepository(fixture.entity);
        const entity = repository.create();
        let data = this.parser.parse(fixture.data, fixture, this.entities);

        if (data.__call) {
            if (typeof data.__call !== 'object') {
                throw new Error('invalid "__call" parameter format');
            }

            for (const [method, values] of Object.entries(data.__call)) {
                if ((entity as any)[method]) {
                    (entity as any)[method].call(
                        entity,
                        this.parser.parse(values instanceof Array ? values : [values], fixture, this.entities),
                    );
                }
            }

            delete data.__call;
        }

        if (fixture.processor) {
            const processorPath = path.resolve(fixture.processor);
            const processorPathWithoutExtension = path.join(
                path.dirname(processorPath),
                path.basename(processorPath, path.extname(processorPath)),
            );

            if (
                !fs.existsSync(processorPathWithoutExtension) &&
                !fs.existsSync(processorPathWithoutExtension + '.ts') &&
                !fs.existsSync(processorPathWithoutExtension + '.js')
            ) {
                throw new Error(`Processor "${processorPath}" not found`);
            }

            const processor = require(processorPath).default;
            const processorInstance = new processor();

            if (typeof processorInstance.preProcess === 'function') {
                data = processorInstance.preProcess(fixture.name, data);
            }

            Object.assign(entity, data);

            if (typeof processorInstance.postProcess === 'function') {
                processorInstance.postProcess(fixture.name, entity);
            }
        } else {
            Object.assign(entity, data);
        }

        this.entities[fixture.name] = entity;

        return entity;
    }
}
