import { IProcessor } from '../../../../src';

export default class UserProcessor implements IProcessor<any> {
    preProcess(name: string, object: { [key: string]: any }): any {
        return { ...object, firstName: 'foo' };
    }

    postProcess(name: string, object: { [key: string]: any }): void {
        object.lastName = 'bar';
    }
}
