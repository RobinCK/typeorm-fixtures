import {IProcessor} from '../../../src/interface';
import {User} from '../entity/User';

export default class UserProcessor implements IProcessor<User> {
    preProcess(name: string, object: {[key: string]: any}): object {
        return {...object, name: `${object.firstName} ${object.lastName}}`};
    }
}
