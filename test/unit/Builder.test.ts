import 'mocha';
import * as path from 'path';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { Builder, Parser } from '../../src';
import { Connection as MockConnection } from './assets/mock/Connection';
import { Connection } from 'typeorm';
import { User } from './assets/entity/User';
import { Listing } from './assets/entity/Listing';

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
            Object.assign(new User(), {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
            }),
        );
    });

    it('should be build and transformed entity', async () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        const result = await builder.build({
            parameters: {},
            entity: 'Listing',
            name: 'listing1',
            processor: undefined,
            dependencies: [],
            data: {
                location: {
                    type: 'Point',
                    coordinates: [1, 2],
                },
            },
        });

        chai.expect((result as Listing).location).to.be.deep.equal({
            lat: 1,
            lng: 2,
        });
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
            Object.assign(new User(), {
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
