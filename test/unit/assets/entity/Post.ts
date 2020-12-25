import {User} from './User';

export class Post {
    title!: string;
    description!: string;
    user!: Promise<User>;

    setTitle(value: string) {
        this.title = value;
    }

    setDescription(value: string) {
        this.description = value;
    }

    setUser(value: Promise<User>) {
        this.user = value;
    }
}
