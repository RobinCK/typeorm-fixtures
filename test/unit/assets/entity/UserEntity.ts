export class UserEntity {
    firstName!: string;
    lastName!: string;
    email!: string;

    setEmail(value: string) {
        this.email = value;
    }

    setFirstName(value: string) {
        this.firstName = value;
    }
}
