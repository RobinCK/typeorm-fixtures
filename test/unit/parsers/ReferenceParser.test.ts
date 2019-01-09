import 'mocha';
import { expect } from 'chai';
import { ReferenceParser } from '../../../src/parsers';

describe('Parameter parser', () => {
    it('should be support', () => {
        const parser = new ReferenceParser();

        expect(parser.isSupport('@user1')).to.equal(true);
    });

    it('should be not support', () => {
        const parser = new ReferenceParser();

        expect(parser.isSupport('{{foo}}')).to.equal(false);
    });

    it('should be resolver', () => {
        const parser = new ReferenceParser();
        const result = parser.parse(
            '@user1',
            {
                parameters: {
                    foo: 'boo',
                },
                entity: 'test',
                name: 'name',
                dependencies: [],
                data: {},
            },
            {
                user1: {
                    name: 'foo',
                },
            },
        );

        expect(result).to.deep.equal({
            name: 'foo',
        });
    });

    it('should be resolver mask', () => {
        const parser = new ReferenceParser();
        const result = parser.parse(
            '@user*',
            {
                parameters: {
                    foo: 'boo',
                },
                entity: 'test',
                name: 'name',
                dependencies: [],
                data: {},
            },
            {
                user1: {
                    name: 'foo',
                },
            },
        );

        expect(result).to.deep.equal({
            name: 'foo',
        });
    });

    it('should be not resolver', () => {
        const parser = new ReferenceParser();
        expect(() =>
            parser.parse(
                '@post1',
                {
                    parameters: {
                        foo: 'boo',
                    },
                    entity: 'test',
                    name: 'name',
                    dependencies: [],
                    data: {},
                },
                {
                    user1: {
                        name: 'foo',
                    },
                },
            ),
        ).to.throw('Reference "@post1" not found');
    });
});
