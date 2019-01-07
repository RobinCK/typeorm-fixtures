import 'mocha';
import * as path from 'path';
import { expect } from 'chai';
import { Loader } from '../../src';

describe('Loader', () => {
    it('should return files data', () => {
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
});
