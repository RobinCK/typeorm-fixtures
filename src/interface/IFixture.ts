export interface IFixture {
    parameters: { [key: string]: any };
    processor?: string;
    locale?: string;
    disableFaker?: boolean;
    entity: string;
    name: string;
    dependencies: string[];
    resolvedFields?: string[];
    data: any;
}
