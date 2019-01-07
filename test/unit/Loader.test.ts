import 'mocha';
import * as path from 'path';
import { expect } from 'chai';
import { Loader } from '../../src';

describe('Loader', () => {
    it('should be loaded data from folder', () => {
        const loader = new Loader();

        loader.load(path.join(__dirname, 'assets/fixtures'));

        expect(loader.fixtureConfigs).to.length(2);
        expect(loader.fixtureConfigs).to.deep.equal([
            {
                entity: 'Post',
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
                items: {
                    user1: {
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

        expect(loader.fixtureConfigs).to.length(1);
        expect(loader.fixtureConfigs).to.deep.equal([
            {
                entity: 'Post',
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
