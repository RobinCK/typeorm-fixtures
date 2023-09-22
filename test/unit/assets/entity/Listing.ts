import { Column, Entity, PrimaryColumn, ValueTransformer } from 'typeorm';
import { Transform } from 'class-transformer';

/**
 * Use to transform object in string (and reverse) to be compatible with SQLITE.
 */
const objectTransformer: ValueTransformer = {
    from: (databaseValue: any): any => {
        return JSON.parse(databaseValue);
    },
    to: (entityValue: any): any => {
        return JSON.stringify(entityValue);
    },
};

@Entity()
export class Listing {
    @PrimaryColumn('int')
    public id!: number;

    @Transform(
        (params) => {
            return {
                lat: params.value.coordinates[0],
                lng: params.value.coordinates[1],
            };
        },
        { toClassOnly: true },
    )
    @Column('varying character', { transformer: objectTransformer })
    public location!: object;
}
