export interface IFixture {
    parameters: { [key: string]: any };
    sourceFile: string;
    processor?: string;
    entity: string;
    name: string;
    dependencies: string[];
    data: any;
}
