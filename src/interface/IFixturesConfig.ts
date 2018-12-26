export interface IFixturesConfig {
    entity: string;
    parameters?: { [key: string]: any };
    transformer?: string;
    items: { [key: string]: any };
}
