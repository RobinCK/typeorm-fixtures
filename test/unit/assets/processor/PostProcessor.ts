import { IProcessor } from '../../../../src';

export default class PostProcessor implements IProcessor<any> {
    postProcess(name: string, object: { [key: string]: any }): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        object = {};
    }
}
