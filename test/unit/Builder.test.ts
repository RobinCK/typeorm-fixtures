import 'mocha';
import * as path from 'path';
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

    it('should be processed entity', () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        const result = builder.build({
            parameters: {},
            entity: 'User',
            name: 'user1',
            processor: path.join(__dirname, 'assets/processor/UserProcessor.ts'),
            dependencies: [],
            data: {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
            },
        });

        expect(result).to.be.deep.equal({
            firstName: 'foo',
            lastName: 'boo',
            email: 'email',
        });
    });

    it('should be processor not found', () => {
        const connection = new MockConnection();
        const parser = new Parser();
        const builder = new Builder(<Connection>connection, parser);

        expect(() =>
            builder.build({
                parameters: {},
                entity: 'User',
                name: 'user1',
                processor: 'assets/processor/UserProcessor.ts',
                dependencies: [],
                data: {
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: 'email',
                },
            }),
        ).to.throw('Processor "assets/processor/UserProcessor.ts" not found');
    });
});
