import 'mocha';
import * as path from 'path';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { Builder, Parser } from '../../src';
import { Connection as MockConnection } from './assets/mock/Connection';
import { Connection } from 'typeorm';
import { UserEntity } from './assets/entity/UserEntity';

chai.use(chaiAsPromised);

describe('Builder', () => {
    it('should be build entity', async () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        const result = await builder.build({
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

        chai.expect(result).to.be.deep.equal(
            Object.assign(new UserEntity(), {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
            }),
        );
    });

    it('should be processed entity', async () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        const result = await builder.build({
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

        chai.expect(result).to.be.deep.equal(
            Object.assign(new UserEntity(), {
                firstName: 'foo',
                lastName: 'boo',
                email: 'email',
            }),
        );
    });

    it('should be call method ', async () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        const result: any = await builder.build({
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
                    setFirstName: 'emaNtsrif',
                },
            },
        });

        chai.expect(result.email).to.be.equal('liame');
        chai.expect(result.firstName).to.be.equal('emaNtsrif');
    });

    it('should be processor not found', () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        chai.expect(
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
        ).to.be.rejectedWith('Processor "assets/processor/UserProcessor.ts" not found');
    });

    it('should be invalid __call parameter', () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        chai.expect(
            builder.build({
                parameters: {},
                entity: 'User',
                name: 'user1',
                dependencies: [],
                data: {
                    __call: [],
                },
            }),
        ).to.be.rejectedWith(`invalid "__call" parameter format`);
    });
});
