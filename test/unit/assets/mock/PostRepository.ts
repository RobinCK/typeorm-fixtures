import {Post} from '../entity/Post';

export class PostRepository {
    create() {
        return new Post();
    }
}
