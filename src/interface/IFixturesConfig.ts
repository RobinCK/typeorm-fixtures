export interface IFixturesConfig {
    sourceFile: string;
    entity: string;
    parameters?: { [key: string]: any };
    processor?: string;
    items: { [key: string]: any };
}
