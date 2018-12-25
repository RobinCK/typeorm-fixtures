export interface IFixtureConfig {
    entity: string;
    parameters?: { [key: string]: any };
    transformer?: string;
    items: { [key: string]: any };
}
