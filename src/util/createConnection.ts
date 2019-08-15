import { Connection, ConnectionOptionsReader, getConnectionManager } from 'typeorm';

export async function createConnection(config: object, connectionName: string): Promise<Connection> {
    const options = await new ConnectionOptionsReader(config).get(connectionName);

    return getConnectionManager()
        .create(options.default ? options.default : options)
        .connect();
}
