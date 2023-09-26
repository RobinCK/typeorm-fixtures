import 'mocha';
import { expect } from 'chai';
import { fixturesIterator, niaveFixturesIterator } from '../../../src/util';

describe('Fixtures Iterator', () => {
    it('should be sort and iterate fixtures', () => {
        const iterator = fixturesIterator([
            {
                parameters: {},
                entity: 'Comment',
                name: 'comment1',
                dependencies: ['user1', 'post1'],
                data: {
                    content: 'firstName',
                    post: '@post1',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post1',
                dependencies: ['user1'],
                data: {
                    title: 'firstName',
                    content: 'lastName',
                    user: '@user1',
                },
            },
            {
                parameters: {},
                entity: 'User',
                name: 'user1',
                dependencies: [],
                data: {
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: 'email',
                },
            },
        ]);

        const fixtures = [];

        for (const fixture of iterator) {
            fixtures.push(fixture);
        }

        expect(fixtures[0].name).to.equal('user1');
        expect(fixtures[1].name).to.equal('post1');
        expect(fixtures[2].name).to.equal('comment1');
    });

    it('should cope with 1 million fixtures in a reasonable period', () => {
        const fixtures = [];

        // Generate 1 million fixtures with random dependencies
        for (let i = 0; i < 1_000_000; i++) {
            const dependencies: string[] = [];
            fixtures.push({
                name: `fixture${i}`,
                parameters: {},
                entity: 'Comment',
                dependencies,
                data: {},
            });
        }

        const start = Date.now();
        const iterator = fixturesIterator(fixtures);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _fixture of iterator) {
            // Do nothing
        }
        const end = Date.now();

        // Check if the time taken is less than 2 seconds
        // On macbook M1 this takes between 800 and 900ms
        const timeTaken = end - start;
        expect(timeTaken).to.be.lessThan(2000);
    });
});
