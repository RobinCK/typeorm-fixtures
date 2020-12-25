import * as fs from 'fs';
import * as path from 'path';
import { isObject, isArray } from 'lodash';
import { Connection } from 'typeorm';
import { IDataParser, IFixture } from './interface';
import { plainToClassFromExist } from 'class-transformer';

export class Builder {
    public entities: any = {};

    constructor(private readonly connection: Connection, private readonly parser: IDataParser) {}

    /**
     * @param {IFixture} fixture
     * @return {any}
     */
    async build(fixture: IFixture) {
        const repository = this.connection.getRepository(fixture.entity);
        let entity = repository.create();
        let data = this.parser.parse(fixture.data, fixture, this.entities);
        let call: object;

        /* istanbul ignore else */
        if (data.__call) {
            if (!isObject(data.__call) || isArray(data.__call)) {
                throw new Error('invalid "__call" parameter format');
            }

            call = data.__call;
            delete data.__call;
        }

        const callExecutors = async () => {
            /* istanbul ignore else */
            if (call) {
                for (const [method, values] of Object.entries(call)) {
                    /* istanbul ignore else */
                    if ((entity as any)[method]) {
                        await (entity as any)[method].apply(
                            entity,
                            this.parser.parse(values instanceof Array ? values : [values], fixture, this.entities),
                        );
                    }
                }
            }
        };

        if (fixture.processor) {
            const processorPathWithoutExtension = path.join(
                path.dirname(fixture.processor),
                path.basename(fixture.processor, path.extname(fixture.processor)),
            );

            if (
                !fs.existsSync(processorPathWithoutExtension) &&
                !fs.existsSync(processorPathWithoutExtension + '.ts') &&
                !fs.existsSync(processorPathWithoutExtension + '.js')
            ) {
                throw new Error(`Processor "${fixture.processor}" not found`);
            }

            const processor = require(processorPathWithoutExtension).default;
            const processorInstance = new processor();

            /* istanbul ignore else */
            if (typeof processorInstance.preProcess === 'function') {
                data = await processorInstance.preProcess(fixture.name, data);
            }

            entity = plainToClassFromExist(entity, data, { ignoreDecorators: true });
            await callExecutors();

            /* istanbul ignore else */
            if (typeof processorInstance.postProcess === 'function') {
                await processorInstance.postProcess(fixture.name, entity);
            }
        } else {
            entity = plainToClassFromExist(entity, data, { ignoreDecorators: true });
            await callExecutors();
        }

        fixture.resolvedFields?.forEach((f) => {
            // @ts-ignore
            entity[f] = Promise.resolve(data[f]);
        });

        this.entities[fixture.name] = entity;

        return entity;
    }
}
