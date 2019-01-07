import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    fullName!: string;

    @Column()
    email!: string;

    @Column()
    text!: string;

    @ManyToOne(type => Post)
    post!: Post;
}
