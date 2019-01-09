import 'mocha';
import { expect, assert } from 'chai';
import { FakerParser } from '../../../src/parsers';

describe('Faker parser', () => {
    it('should be support', () => {
        const parser = new FakerParser();

        expect(parser.isSupport('{{foo}}')).to.equal(true);
    });

    it('should be not support', () => {
        const parser = new FakerParser();

        expect(parser.isSupport('((foo))')).to.equal(false);
    });

    it('should be number', () => {
        const parser = new FakerParser();
        const result = parser.parse('{{random.number}}');

        assert.isNumber(result);
    });

    it('should be boolean', () => {
        const parser = new FakerParser();
        const result = parser.parse('{{random.boolean}}');

        assert.isBoolean(result);
    });

    it('should be string', () => {
        const parser = new FakerParser();
        const result = parser.parse('{{random.word}}');

        assert.isString(result);
    });
});
