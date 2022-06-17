import { UserRepository } from './UserRepository';
import { ListingRepository } from './ListingRepository';
import { PostRepository } from './PostRepository';

export class Connection {
    getRepository(name: string) {
        switch (name) {
            case 'User':
                return new UserRepository();
            case 'Listing':
                return new ListingRepository();
            case 'Post':
                return new PostRepository();
            default:
                throw new Error(`Repository "${name}" not found! Please update ${__dirname}/Connection.ts`);
        }
    }
}
