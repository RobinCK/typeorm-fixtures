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

        expect(fixtures[0].name).to.equal('user1');
        expect(fixtures[1].name).to.equal('post1');
        expect(fixtures[2].name).to.equal('comment1');
    });
});
