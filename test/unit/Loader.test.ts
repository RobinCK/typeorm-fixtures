import 'mocha';
import * as path from 'path';
import { expect } from 'chai';
import { IFixturesConfig, Loader } from '../../src';

describe('Loader', () => {
    it('should be loaded data from folder', () => {
        const loader = new Loader();

        loader.load(path.join(__dirname, 'assets/fixtures'));

        const configs = loader.fixtureConfigs.map((fixtureConfig: IFixturesConfig) => {
            fixtureConfig.processor = '';

            return fixtureConfig;
        });

        expect(configs).to.length(3);
        expect(configs).to.deep.equal([
            {
                entity: 'Post',
                locale: 'pl',
                processor: '',
                items: {
                    post1: {
                        title: '{{name.title}}',
                        description: '{{lorem.paragraphs}}',
                        user: '@user($current)',
                    },
                },
            },
            {
                entity: 'User',
                locale: 'pl',
                processor: '',
                items: {
                    user1: {
                        firstName: '{{name.firstName}}',
                        lastName: '{{name.lastName}}',
                        email: '{{internet.email}}',
                    },
                },
            },
            {
                entity: 'User',
                locale: 'pl',
                processor: '',
                items: {
                    user2: {
                        firstName: '{{name.firstName}}',
                        lastName: '{{name.lastName}}',
                        email: '{{internet.email}}',
                    },
                },
            },
        ]);
    });

    it('should be loaded data from file', () => {
        const loader = new Loader();

        loader.load(path.join(__dirname, 'assets/fixtures/Post.yml'));

        const configs = loader.fixtureConfigs.map((fixtureConfig: IFixturesConfig) => {
            fixtureConfig.processor = '';

            return fixtureConfig;
        });

        expect(configs).to.length(1);
        expect(configs).to.deep.equal([
            {
                entity: 'Post',
                processor: '',
                locale: 'pl',
                items: {
                    post1: {
                        title: '{{name.title}}',
                        description: '{{lorem.paragraphs}}',
                        user: '@user($current)',
                    },
                },
            },
        ]);
    });

    it('should be fail load', () => {
        const loader = new Loader();

        expect(() => loader.load(path.join(__dirname, 'assets/fixtures/Comment.txt'))).to.throw(
            'File extension ".txt" not support',
        );
    });

    it('should be no such file', () => {
        const loader = new Loader();

        expect(() => loader.load(path.join(__dirname, 'assets/fixtures/Foo.txt'))).to.throw(
            'no such file or directory,',
        );
    });

    it('should be invalid fixture config', () => {
        const loader = new Loader();

        expect(() => loader.load(path.join(__dirname, 'assets/fixtures-invalid'))).to.throw('Invalid fixtures config.');
    });
});
