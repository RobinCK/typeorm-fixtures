export class User {
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;

    setEmail(value: string) {
        this.email = value;
    }

    setFirstName(value: string) {
        this.firstName = value;
    }

    async setPassword(value: string) {
        this.password = (await value) + 'md5';
    }
}
