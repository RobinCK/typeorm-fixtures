import { UserRepository } from './UserRepository';
import { ListingRepository } from './ListingRepository';

export class Connection {
    getRepository(name: string) {
        switch (name) {
            case 'User':
                return new UserRepository();
            case 'Listing':
                return new ListingRepository();
            default:
                throw new Error(`Repository "${name}" not found! Please update ${__dirname}/Connection.ts`);
        }
    }
}
