import { ConnectionOptionsReader, DataSource, DataSourceOptions } from 'typeorm';

export async function createConnection(
    config: { root?: string | undefined; configName?: string | undefined },
    connectionName: string,
): Promise<DataSource> {
    const options: DataSourceOptions = await new ConnectionOptionsReader(config).get(connectionName);

    return new DataSource(options).initialize();
}
