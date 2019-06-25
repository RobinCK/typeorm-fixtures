import { Listing } from '../entity/Listing';

export class ListingRepository {
    create() {
        return new Listing();
    }
}
