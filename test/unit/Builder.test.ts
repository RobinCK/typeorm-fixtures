import 'mocha';
import * as path from 'path';
import { expect } from 'chai';
import { Builder, Parser } from '../../src';
import { Connection as MockConnection } from './assets/mock/Connection';
import { Connection } from 'typeorm';
import { UserEntity } from './assets/entity/UserEntity';

describe('Builder', () => {
    it('should be build entity', () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        const result = builder.build({
            parameters: {},
            entity: 'User',
            name: 'user1',
            processor: undefined,
            dependencies: [],
            data: {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
            },
        });

        expect(result).to.be.deep.equal(
            Object.assign(new UserEntity(), {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
            }),
        );
    });

    it('should be processed entity', () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        const result = builder.build({
            parameters: {},
            entity: 'User',
            name: 'user1',
            processor: path.join(__dirname, 'assets/processor/UserProcessor.ts'),
            dependencies: [],
            data: {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
            },
        });

        expect(result).to.be.deep.equal(
            Object.assign(new UserEntity(), {
                firstName: 'foo',
                lastName: 'boo',
                email: 'email',
            }),
        );
    });

    it('should be call method', () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        const result: any = builder.build({
            parameters: {},
            entity: 'User',
            name: 'user1',
            processor: path.join(__dirname, 'assets/processor/UserProcessor.ts'),
            dependencies: [],
            data: {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
                __call: {
                    setEmail: ['liame'],
                },
            },
        });

        expect(result.email).to.be.equal('liame');
    });

    it('should be processor not found', () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        expect(() =>
            builder.build({
                parameters: {},
                entity: 'User',
                name: 'user1',
                processor: 'assets/processor/UserProcessor.ts',
                dependencies: [],
                data: {
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: 'email',
                },
            }),
        ).to.throw('Processor "assets/processor/UserProcessor.ts" not found');
    });
});
