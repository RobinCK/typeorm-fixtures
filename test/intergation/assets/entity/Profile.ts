import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    aboutMe!: string;

    @Column()
    skype!: string;

    @Column()
    language!: string;
}
