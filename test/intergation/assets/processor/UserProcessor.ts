import { IProcessor } from '../../../../src/interface/index';
import { User } from '../entity/User';

export default class UserProcessor implements IProcessor<User> {
    postProcess(name: string, object: { [key: string]: any }): void {
        object.name = `${object.firstName} ${object.lastName}`;
    }
}
