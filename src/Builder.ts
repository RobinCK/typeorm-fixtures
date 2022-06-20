import * as fs from 'fs';
import * as path from 'path';
import { isObject, isArray } from 'lodash';
import { IDataParser, IEntity, IFixture, IProcessor } from './interface';
import { DataSource } from 'typeorm';
import { plainToClassFromExist } from 'class-transformer';

export class Builder {
    public entities: any = {};

    constructor(private readonly dataSource: DataSource, private readonly parser: IDataParser) {}

    private async callExecutors(entity: IEntity, fixture: IFixture, data: any): Promise<IEntity> {
        /* istanbul ignore else */
        for (const [method, values] of Object.entries(data.__call)) {
            /* istanbul ignore else */
            if ((entity as any)[method]) {
                await (entity as any)[method].apply(
                    entity,
                    this.parser.parse(values instanceof Array ? values : [values], fixture, this.entities),
                );
            }
        }

        return entity;
    }

    private async buildEntity(fixture: IFixture, data: any): Promise<IEntity> {
        const repository = this.dataSource.getRepository(fixture.entity);
        const entity: IEntity = repository.create() as IEntity;

        // exclude prefixes to ignore __call methods
        return plainToClassFromExist(entity, data, { excludePrefixes: ['__'], ignoreDecorators: false });
    }

    async build(fixture: IFixture): Promise<IEntity> {
        let entity: IEntity;
        let data = this.parser.parse(fixture.data, fixture, this.entities);
        let processorInstance: IProcessor<any> | undefined = undefined;

        /* istanbul ignore else */
        if (data.__call && (!isObject(data.__call) || isArray(data.__call))) {
            throw new Error('invalid "__call" parameter format');
        }

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
            processorInstance = new processor();
        }

        /* istanbul ignore else */
        if (processorInstance && typeof processorInstance.preProcess === 'function') {
            data = await processorInstance.preProcess(fixture.name, data);
        }

        entity = await this.buildEntity(fixture, data);
        if (data.__call) {
            entity = await this.callExecutors(entity, fixture, data);
        }

        /* istanbul ignore else */
        if (processorInstance && typeof processorInstance.postProcess === 'function') {
            await processorInstance.postProcess(fixture.name, entity);
        }

        if (fixture.resolvedFields && Array.isArray(fixture.resolvedFields)) {
            fixture.resolvedFields.forEach((propertyName) => {
                entity[propertyName] = Promise.resolve(data[propertyName]);
            });
        }

        this.entities[fixture.name] = entity;

        return entity;
    }
}
