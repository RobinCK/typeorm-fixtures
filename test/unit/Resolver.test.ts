import 'mocha';
import * as path from 'path';
import { expect, assert } from 'chai';
import { Loader, Resolver } from '../../src';

describe('Resolver', () => {
    it('should be resolved fixtures', () => {
        const loader = new Loader();
        loader.load(path.join(__dirname, 'assets/fixtures'));

        const resolver = new Resolver();
        const result = resolver.resolve(loader.fixtureConfigs).map((f) => {
            delete f.processor;
            delete f.resolvedFields;

            return f;
        });

        expect(result).to.deep.equal([
            {
                parameters: {},
                entity: 'User',
                name: 'user1',
                dependencies: [],
                data: {
                    firstName: '{{name.firstName}}',
                    lastName: '{{name.lastName}}',
                    email: '{{internet.email}}',
                },
            },
            {
                parameters: {},
                entity: 'User',
                name: 'user2',
                dependencies: [],
                data: {
                    firstName: '{{name.firstName}}',
                    lastName: '{{name.lastName}}',
                    email: '{{internet.email}}',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post1',
                dependencies: ['user1'],
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                    user: '@user1',
                },
            },
        ]);
    });

    it('should be resolved range fixtures', () => {
        const resolver = new Resolver();
        const result = resolver.resolve([
            {
                entity: 'Post',
                items: {
                    'post{1..3}': {
                        title: '{{name.title}}',
                        description: '{{lorem.paragraphs}}',
                    },
                },
            },
        ]);

        expect(result).to.deep.equal([
            {
                parameters: {},
                entity: 'Post',
                name: 'post1',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post2',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post3',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                },
            },
        ]);
    });

    it('should be resolved range reference', () => {
        const resolver = new Resolver();
        const result = resolver.resolve([
            {
                entity: 'Post',
                items: {
                    post1: {
                        title: '{{name.title}}',
                        description: '{{lorem.paragraphs}}',
                        user: '@user{1..2}',
                    },
                },
            },

            {
                entity: 'User',
                items: {
                    'user{1..2}': {
                        firstName: '{{name.firstName}}',
                        lastName: '{{name.lastName}}',
                        email: '{{internet.email}}',
                    },
                },
            },
        ]);

        const post = result.find((f) => f.entity === 'Post') || { data: {} };

        assert.isTrue(post.data.user === '@user2' || post.data.user === '@user1');
    });

    it('should be resolved range fixtures', () => {
        const resolver = new Resolver();
        const result = resolver.resolve([
            {
                entity: 'Post',
                items: {
                    'post{1..3}': {
                        title: '{{name.title}}',
                        description: '{{lorem.paragraphs}}',
                    },
                },
            },
        ]);

        expect(result).to.deep.equal([
            {
                parameters: {},
                entity: 'Post',
                name: 'post1',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post2',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post3',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                },
            },
        ]);
    });

    it('should be resolved deep reference', () => {
        const resolver = new Resolver();
        const result = resolver.resolve([
            {
                entity: 'Post',
                items: {
                    post1: {
                        title: '{{name.title}}',
                        description: '{{lorem.paragraphs}}',
                        data: {
                            user: '@user1',
                        },
                    },
                },
            },
            {
                entity: 'User',
                items: {
                    user1: {
                        firstName: '{{name.firstName}}',
                        lastName: '{{name.lastName}}',
                        email: '{{internet.email}}',
                    },
                },
            },
        ]);

        const post: any = result.find((f) => f.entity === 'Post') || { data: {} };

        expect(post.dependencies).to.be.include('user1');
    });

    it('should be resolved mask reference', () => {
        const resolver = new Resolver();
        const result = resolver.resolve([
            {
                entity: 'Post',
                items: {
                    post1: {
                        title: '{{name.title}}',
                        description: '{{lorem.paragraphs}}',
                        user: '@user*',
                    },
                },
            },
            {
                entity: 'User',
                items: {
                    user1: {
                        firstName: '{{name.firstName}}',
                        lastName: '{{name.lastName}}',
                        email: '{{internet.email}}',
                    },
                },
            },
        ]);

        const post: any = result.find((f) => f.entity === 'Post') || { data: {} };

        expect(post.dependencies).to.be.include('user1');
    });

    it('should be resolved current', () => {
        const resolver = new Resolver();
        const result = resolver.resolve([
            {
                entity: 'Post',
                items: {
                    'post{1..3}': {
                        title: '{{name.title}}',
                        description: '{{lorem.paragraphs}}',
                        user: '@user($current)',
                    },
                },
            },
            {
                entity: 'User',
                items: {
                    'user{1..3}': {
                        firstName: 'firstName($current)',
                        lastName: '{{name.lastName}}',
                        email: '{{internet.email}}',
                    },
                },
            },
        ]);

        expect(result).to.deep.equal([
            {
                parameters: {},
                entity: 'User',
                name: 'user1',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    firstName: 'firstName1',
                    lastName: '{{name.lastName}}',
                    email: '{{internet.email}}',
                },
            },
            {
                parameters: {},
                entity: 'User',
                name: 'user2',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    firstName: 'firstName2',
                    lastName: '{{name.lastName}}',
                    email: '{{internet.email}}',
                },
            },
            {
                parameters: {},
                entity: 'User',
                name: 'user3',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    firstName: 'firstName3',
                    lastName: '{{name.lastName}}',
                    email: '{{internet.email}}',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post1',
                processor: undefined,
                dependencies: ['user1'],
                resolvedFields: undefined,
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                    user: '@user1',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post2',
                processor: undefined,
                dependencies: ['user2'],
                resolvedFields: undefined,
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                    user: '@user2',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post3',
                processor: undefined,
                dependencies: ['user3'],
                resolvedFields: undefined,
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                    user: '@user3',
                },
            },
        ]);
    });

    it('should be resolved calculated current', () => {
        const resolver = new Resolver();
        const result = resolver.resolve([
            {
                entity: 'User',
                items: {
                    'user{1..3}': {
                        firstName: 'firstName($current*100)',
                        lastName: '{{name.lastName}}',
                        email: '{{internet.email}}',
                    },
                },
            },
        ]);

        expect(result).to.deep.equal([
            {
                parameters: {},
                entity: 'User',
                name: 'user1',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    firstName: 'firstName100',
                    lastName: '{{name.lastName}}',
                    email: '{{internet.email}}',
                },
            },
            {
                parameters: {},
                entity: 'User',
                name: 'user2',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    firstName: 'firstName200',
                    lastName: '{{name.lastName}}',
                    email: '{{internet.email}}',
                },
            },
            {
                parameters: {},
                entity: 'User',
                name: 'user3',
                processor: undefined,
                dependencies: [],
                resolvedFields: undefined,
                data: {
                    firstName: 'firstName300',
                    lastName: '{{name.lastName}}',
                    email: '{{internet.email}}',
                },
            },
        ]);
    });

    it('should be fail resolved current', () => {
        const resolver = new Resolver();

        expect(() =>
            resolver.resolve([
                {
                    entity: 'Post',
                    items: {
                        post: {
                            title: '{{name.title}}',
                            description: '{{lorem.paragraphs}}',
                            user: '@user($current)',
                        },
                    },
                },
                {
                    entity: 'User',
                    items: {
                        user1: {
                            firstName: '{{name.firstName}}',
                            lastName: '{{name.lastName}}',
                            email: '{{internet.email}}',
                        },
                    },
                },
            ]),
        ).to.be.throw('Error parsed index in reference: "user($current)" and fixture identify: post');
    });

    it('should be reference not found', () => {
        const resolver = new Resolver();

        expect(() =>
            resolver.resolve([
                {
                    entity: 'Post',
                    items: {
                        post: {
                            title: '{{name.title}}',
                            description: '{{lorem.paragraphs}}',
                            user: '@user2',
                        },
                    },
                },
                {
                    entity: 'User',
                    items: {
                        user1: {
                            firstName: '{{name.firstName}}',
                            lastName: '{{name.lastName}}',
                            email: '{{internet.email}}',
                        },
                    },
                },
            ]),
        ).to.be.throw('Reference "user2" not found');
    });

    it('should be resolved with equal dependencies for wildcard', () => {
        const resolver = new Resolver();
        const result = resolver.resolve([
            {
                entity: 'Post',
                items: {
                    'post{1..3}': {
                        title: '{{name.title}}',
                        user: '@user*',
                    },
                },
            },
            {
                entity: 'User',
                items: {
                    'user{1..2}': {
                        email: '{{internet.email}}',
                    },
                },
            },
        ]);

        const posts: any[] = result.filter((f) => f.entity === 'Post');

        const dependencies = ['user1', 'user2'];
        expect(posts).to.satisfy((items: any[]) =>
            items.every((post: { dependencies: string[] }) => {
                return post.dependencies.every((dependency, index) => dependency === dependencies[index]);
            }),
        );
    });
});
