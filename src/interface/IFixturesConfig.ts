export interface IFixturesConfig {
    entity: string;
    locale?: string;
    parameters?: { [key: string]: any };
    processor?: string;
    items: { [key: string]: any };
}
