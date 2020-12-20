export interface IFixturesConfig {
    entity: string;
    locale?: string;
    parameters?: { [key: string]: any };
    processor?: string;
    resolvedFields?: string[];
    items: { [key: string]: any };
}
