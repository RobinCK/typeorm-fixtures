export interface IFixturesConfig {
    entity: string;
    parameters?: { [key: string]: any };
    processor?: string;
    items: { [key: string]: any };
}
