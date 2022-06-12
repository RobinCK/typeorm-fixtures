import { Transform } from 'class-transformer';

export class Listing {
    @Transform(
        (params) => {
            return {
                lat: params.value.coordinates[0],
                lng: params.value.coordinates[1],
            };
        },
        { toClassOnly: true },
    )
    location!: object;
}
