import 'mocha';
import { expect } from 'chai';
import { EjsParser } from '../../../src/parsers';
import { IFixture } from '../../../src/interface';

describe('EJS parser', () => {
    it('should be support', () => {
        const parser = new EjsParser();

        expect(parser.isSupport('<%foo%>')).to.equal(true);
    });

    it('should be not support', () => {
        const parser = new EjsParser();

        expect(parser.isSupport('{{foo}}')).to.equal(false);
    });

    it('should be parsed', () => {
        const parser = new EjsParser();
        const result = parser.parse('<%= ["1", "2"].join("") %>', {} as IFixture);

        expect(result).to.equal('12');
    });
});
