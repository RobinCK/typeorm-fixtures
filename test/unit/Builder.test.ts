import 'mocha';
import * as path from 'path';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { Builder, Parser } from '../../src';
import { Connection as MockConnection } from './assets/mock/Connection';
import { DataSource } from 'typeorm';
import { User } from './assets/entity/User';
import { Listing } from './assets/entity/Listing';
import { Post } from './assets/entity/Post';

chai.use(chaiAsPromised);

describe('Builder', () => {
    it('should be build entity', async () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<DataSource>connection, parser, false);

        const result = await builder.build({
            parameters: {},
            entity: 'User',
            name: 'user1',
            processor: undefined,
            dependencies: [],
            resolvedFields: undefined,
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
        const builder = new Builder(<DataSource>connection, parser, false);

        const result = await builder.build({
            parameters: {},
            entity: 'Listing',
            name: 'listing1',
            processor: undefined,
            dependencies: [],
            resolvedFields: undefined,
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
        const builder = new Builder(<DataSource>connection, parser, false);

        const result = await builder.build({
            parameters: {},
            entity: 'User',
            name: 'user1',
            processor: path.join(__dirname, 'assets/processor/UserProcessor.ts'),
            dependencies: [],
            resolvedFields: undefined,
            data: {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
            },
        });

        chai.expect(result).to.be.deep.equal(
            Object.assign(new User(), {
                firstName: 'foo',
                lastName: 'bar',
                email: 'email',
            }),
        );
    });

    it('should be call method ', async () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<DataSource>connection, parser, false);

        const result: any = await builder.build({
            parameters: {},
            entity: 'User',
            name: 'user1',
            processor: path.join(__dirname, 'assets/processor/UserProcessor.ts'),
            dependencies: [],
            resolvedFields: undefined,
            data: {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
                __call: {
                    setEmail: ['liame'],
                    setFirstName: 'emaNtsrif',
                    setPassword: 'mypassword',
                },
            },
        });

        chai.expect(result.email).to.be.equal('liame');
        chai.expect(result.firstName).to.be.equal('emaNtsrif');
    });

    it('should be processor not found', () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<DataSource>connection, parser, false);

        chai.expect(
            builder.build({
                parameters: {},
                entity: 'User',
                name: 'user1',
                processor: 'assets/processor/UserProcessor.ts',
                dependencies: [],
                resolvedFields: undefined,
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
        const builder = new Builder(<DataSource>connection, parser, false);

        chai.expect(
            builder.build({
                parameters: {},
                entity: 'User',
                name: 'user1',
                resolvedFields: undefined,
                dependencies: [],
                data: {
                    __call: [],
                },
            }),
        ).to.be.rejectedWith('invalid "__call" parameter format');
    });

    it('should be resolved entity field as promised', async () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<DataSource>connection, parser, false);
        builder.entities = {
            user1: Object.assign(new User(), {
                firstName: 'foo',
                lastName: 'boo',
                email: 'email',
            }),
        };

        const result = await builder.build({
            parameters: {},
            entity: 'Post',
            name: 'post1',
            dependencies: ['user1'],
            processor: undefined,
            resolvedFields: ['user'],
            data: {
                title: 'A Post',
                description: 'A description',
                user: '@user1',
            },
        });

        chai.expect(result).to.be.instanceOf(Post);
        const post = result as Post;
        const awaitedResult = {
            title: post.title,
            description: post.description,
            user: await post.user,
        };

        chai.expect(awaitedResult).to.be.deep.equal({
            title: 'A Post',
            description: 'A description',
            user: builder.entities['user1'],
        });
    });
});
