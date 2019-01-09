import 'mocha';
import { expect } from 'chai';
import { Parser } from '../../src';

describe('Parser', () => {
    it('should be parsed object', () => {
        const parser = new Parser();

        expect(
            parser.parse(
                { prop: '<{foo}>' },
                {
                    parameters: {
                        foo: 'boo',
                    },
                    entity: 'test',
                    name: 'name',
                    dependencies: [],
                    data: {},
                },
                {},
            ),
        ).to.deep.equal({ prop: 'boo' });
    });

    it('should be parsed array', () => {
        const parser = new Parser();

        expect(
            parser.parse(
                ['<{foo}>'],
                {
                    parameters: {
                        foo: 'boo',
                    },
                    entity: 'test',
                    name: 'name',
                    dependencies: [],
                    data: {},
                },
                {},
            ),
        ).to.deep.equal(['boo']);
    });

    it('should be parsed deep object', () => {
        const parser = new Parser();

        expect(
            parser.parse(
                { prop: { deep: '<{foo}>' } },
                {
                    parameters: {
                        foo: 'boo',
                    },
                    entity: 'test',
                    name: 'name',
                    dependencies: [],
                    data: {},
                },
                {},
            ),
        ).to.deep.equal({ prop: { deep: 'boo' } });
    });

    it('should be parsed deep array', () => {
        const parser = new Parser();

        expect(
            parser.parse(
                { prop: { deep: ['<{foo}>'] } },
                {
                    parameters: {
                        foo: 'boo',
                    },
                    entity: 'test',
                    name: 'name',
                    dependencies: [],
                    data: {},
                },
                {},
            ),
        ).to.deep.equal({ prop: { deep: ['boo'] } });
    });
});
