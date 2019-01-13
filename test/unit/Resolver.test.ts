import 'mocha';
import * as path from 'path';
import { expect, assert } from 'chai';
import { Loader, Resolver } from '../../src';

describe('Resolver', () => {
    it('should be resolved fixtures', () => {
        const loader = new Loader();
        loader.load(path.join(__dirname, 'assets/fixtures'));

        const resolver = new Resolver();
        const result = resolver.resolve(loader.fixtureConfigs).map(f => {
            delete f.processor;

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

        const post = result.find(f => f.entity === 'Post') || { data: {} };

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

        const post: any = result.find(f => f.entity === 'Post') || { data: {} };

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

        const post: any = result.find(f => f.entity === 'Post') || { data: {} };

        expect(post.dependencies).to.be.include('user1');
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
});
