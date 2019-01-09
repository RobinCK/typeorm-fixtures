import { IProcessor } from '../../../../src/interface';

export default class PostProcessor implements IProcessor<any> {
    postProcess(name: string, object: { [key: string]: any }): void {
        object = {};
    }
}
