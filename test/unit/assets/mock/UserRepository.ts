import { User } from '../entity/User';

export class UserRepository {
    create() {
        return new User();
    }
}
