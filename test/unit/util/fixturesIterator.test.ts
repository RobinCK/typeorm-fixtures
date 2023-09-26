import 'mocha';
import { expect } from 'chai';
import { fixturesIterator } from '../../../src/util';

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

        expect(fixtures[0]?.name).to.equal('user1');
        expect(fixtures[1]?.name).to.equal('post1');
        expect(fixtures[2]?.name).to.equal('comment1');
    });

    it('should throw if there is a cycle', () => {
        fixturesIterator([
            {
                parameters: {},
                entity: 'Post',
                name: 'post1',
                dependencies: ['post1'],
                data: {},
            },
            {
                parameters: {},
                entity: 'User',
                name: 'user1',
                dependencies: ['user1'],
                data: {},
            },
        ]);
    });

    it('should cope with large number of fixtures in a reasonable period', () => {
        const fixtures = [];

        for (let i = 0; i < 100_000; i++) {
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

        // On macbook M1 this takes between 100 and 200ms
        const timeTaken = end - start;
        expect(timeTaken).to.be.lessThan(500);
    });
});
