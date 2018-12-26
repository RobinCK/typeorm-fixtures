export interface IFixture {
    parameters: {[key: string]: any};
    transformer: string;
    entity: string;
    name: string;
    dependencies: string[];
    data: any;
}
