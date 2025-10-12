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

    it('should parse `null` as `null`', () => {
        const parser = new Parser();

        expect(
            parser.parse(
                { prop: { value: null } },
                {
                    parameters: {},
                    entity: 'test',
                    name: 'name',
                    dependencies: [],
                    data: {},
                },
                {},
            ),
        ).to.deep.equal({ prop: { value: null } });
    });

    it('should not parse faker expressions when disableFaker is true', () => {
        const parser = new Parser();

        expect(
            parser.parse(
                { template: '{{name.firstName}} {{name.lastName}}' },
                {
                    parameters: {},
                    entity: 'test',
                    name: 'name',
                    dependencies: [],
                    disableFaker: true,
                    data: {},
                },
                {},
            ),
        ).to.deep.equal({ template: '{{name.firstName}} {{name.lastName}}' });
    });

    it('should parse faker expressions when disableFaker is false', () => {
        const parser = new Parser();

        const result = parser.parse(
            { greeting: 'Hello {{name.firstName}}' },
            {
                parameters: {},
                entity: 'test',
                name: 'name',
                dependencies: [],
                disableFaker: false,
                data: {},
            },
            {},
        );

        expect(result.greeting).to.not.equal('Hello {{name.firstName}}');
        expect(result.greeting).to.include('Hello ');
    });
});
