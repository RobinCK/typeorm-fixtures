import { Column, Entity, PrimaryColumn } from 'typeorm';

import { User } from './User';

@Entity()
export class Post {
    @PrimaryColumn('int')
    public id!: number;

    @Column()
    public title!: string;

    @Column()
    public description!: string;

    @Column('int')
    public user!: Promise<User>;

    public setTitle(value: string): void {
        this.title = value;
    }

    public setDescription(value: string): void {
        this.description = value;
    }

    public setUser(value: Promise<User>): void {
        this.user = value;
    }
}
