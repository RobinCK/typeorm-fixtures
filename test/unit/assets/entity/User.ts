import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn('int')
    public id!: number;

    @Column()
    public firstName!: string;

    @Column()
    public lastName!: string;

    @Column()
    public email!: string;

    @Column()
    public password!: string;

    public setEmail(value: string): void {
        this.email = value;
    }

    public setFirstName(value: string): void {
        this.firstName = value;
    }

    public async setPassword(value: string): Promise<void> {
        this.password = (await value) + 'md5';
    }
}
