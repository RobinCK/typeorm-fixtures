import 'mocha';
import { expect } from 'chai';
import { ParameterParser } from '../../../src/parsers';

describe('Parameter parser', () => {
    it('should be support', () => {
        const parser = new ParameterParser();

        expect(parser.isSupport('<{foo}>')).to.equal(true);
    });

    it('should be not support', () => {
        const parser = new ParameterParser();

        expect(parser.isSupport('{{foo}}')).to.equal(false);
    });

    it('should be parsed', () => {
        const parser = new ParameterParser();
        const result = parser.parse('<{foo}>', {
            parameters: {
                foo: 'boo',
            },
            entity: 'test',
            name: 'name',
            dependencies: [],
            data: {},
        });

        expect(result).to.equal('boo');
    });

    it('should be not parsed', () => {
        const parser = new ParameterParser();

        expect(() =>
            parser.parse('<{boo}>', {
                parameters: {
                    foo: 'boo',
                },
                entity: 'test',
                name: 'name',
                dependencies: [],
                data: {},
            }),
        ).to.throw('Unknown parameter "boo" in name');
    });
});
