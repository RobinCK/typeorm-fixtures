import * as fs from 'fs';
import * as path from 'path';
import { Connection } from 'typeorm';
import * as parsers from './parser';
import { IFixture, IParser } from './interface';

export class Resolver {
    private parsers: IParser[] = [];
    public entities: any = {};

    /**
     * @param {Connection} connection
     */
    constructor(private readonly connection: Connection) {
        for (const parser of Object.values(parsers)) {
            this.parsers.push(new (parser as any)());
        }
    }

    /**
     * @param {IFixture} fixture
     * @return {any}
     */
    resolve(fixture: IFixture) {
        const repository = this.connection.getRepository(fixture.entity);
        const entity = repository.create();
        let data = this.parse(fixture.data, fixture);

        if (data.__call) {
            if (typeof data.__call !== 'object') {
                throw new Error('invalid "__call" parameter format');
            }

            for (const [method, values] of Object.entries(data.__call)) {
                if ((entity as any)[method]) {
                    (entity as any)[method].call(
                        entity,
                        this.parse(values instanceof Array ? values : [values], fixture),
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

    /**
     * @param {object | any} data
     * @param {IFixture} fixture
     * @return {any}
     */
    private parse(data: object | any, fixture: IFixture): any {
        const entityRawData = data instanceof Array ? [...data] : { ...data };

        for (const [key, value] of Object.entries(entityRawData)) {
            if (typeof value === 'string') {
                for (const parser of this.parsers.sort((a, b) => b.priority - a.priority)) {
                    if (parser.isSupport(value)) {
                        entityRawData[key] = parser.parse(value, fixture, this.entities);
                    }
                }
            } else if (typeof value === 'object') {
                entityRawData[key] = this.parse(value, fixture);
            }
        }

        return entityRawData;
    }
}
