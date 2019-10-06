import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './Profile';
import { Group } from './Group';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    name?: string;

    @Column()
    password!: string;

    @Column()
    email!: string;

    @OneToOne(type => Profile)
    @JoinColumn()
    profile!: Profile;

    @ManyToMany(type => Group, group => group.members)
    groups!: Group[];

    setPassword(value: string) {
        this.password = value + 'md5';
    }
}
