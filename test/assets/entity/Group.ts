import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(type => User)
    owner!: User;

    @ManyToMany(type => User, user => user.groups)
    @JoinTable()
    members!: User[];
}
