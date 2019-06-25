import { Transform } from 'class-transformer';

export class Listing {
    @Transform(
        value => {
            return {
                lat: value.coordinates[0],
                lng: value.coordinates[1],
            };
        },
        { toClassOnly: true },
    )
    location!: object;
}
