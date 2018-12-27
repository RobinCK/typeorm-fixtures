import {Column, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Profile} from './Profile';
import {Group} from './Group';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    email!: string;

    @OneToOne(type => Profile)
    profile!: Profile;

    @ManyToMany(type => Group, group => group.members)
    groups!: Group[];
}
