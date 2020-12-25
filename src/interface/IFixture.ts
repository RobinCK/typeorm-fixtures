export interface IFixture {
    parameters: { [key: string]: any };
    processor?: string;
    locale?: string;
    entity: string;
    name: string;
    dependencies: string[];
    data: any;
}
