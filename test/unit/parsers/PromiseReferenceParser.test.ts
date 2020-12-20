import 'mocha';
import { expect } from 'chai';
import {PromiseReferenceParser, ReferenceParser} from '../../../src/parsers';

describe('Parameter parser', () => {
    it('should be support', () => {
        const parser = new PromiseReferenceParser();
        expect(parser.isSupport('resolve(@user1)')).to.equal(true);
    });

    it('should be not support', () => {
        const parser = new PromiseReferenceParser();
        expect(parser.isSupport('{{foo}}')).to.equal(false);
        expect(parser.isSupport('@user1')).to.equal(false);
    });

    it('should be resolver', async () => {
        const parser = new PromiseReferenceParser();
        const result = parser.parse(
            'resolve(@user1)',
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

        const pr = await result;
        expect(pr).to.deep.equal({
            name: 'foo',
        });
    });

    it('should be resolver mask', async () => {
        const parser = new PromiseReferenceParser();
        const result = parser.parse(
            'resolve(@user*)',
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

        const pr = await result;
        expect(pr).to.deep.equal({
            name: 'foo',
        });
    });

    it('should be not resolver', () => {
        const parser = new PromiseReferenceParser();
        expect(() =>
            parser.parse(
                'resolve(@post1)',
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
