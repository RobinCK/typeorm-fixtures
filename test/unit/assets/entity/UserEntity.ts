export class UserEntity {
    firstName!: string;
    lastName!: string;
    email!: string;

    setEmail(email: string) {
        this.email = email;
    }
}
