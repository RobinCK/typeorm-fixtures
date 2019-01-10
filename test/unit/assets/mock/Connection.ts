import { Repository } from './Repository';

export class Connection {
    getRepository(name: string) {
        return new Repository();
    }
}
