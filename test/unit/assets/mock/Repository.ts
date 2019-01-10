import { UserEntity } from '../entity/UserEntity';

export class Repository {
    create() {
        return new UserEntity();
    }
}
