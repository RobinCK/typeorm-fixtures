import 'mocha';
import { expect } from 'chai';
import { Builder, Parser } from '../../src';
import { Connection as MockConnection } from './assets/mock/Connection';
import { Connection } from 'typeorm';

describe('Builder', () => {
    it('should be build entity', () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        const result = builder.build({
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

        expect(result).to.be.deep.equal({
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
        });
    });
});
