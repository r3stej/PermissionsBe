import config from '../Config';
import DatabaseAdapter from './interfaces/DatabaseAdapter';
import { KVDatabaseAdapter } from './implementations/kvd/KVDatabaseAdapter';
import { MongoDatabaseAdapter } from './implementations/mongo/MongoDatabaseAdapter';

import { Initializable } from '../interfaces/Initializable';

class DatabaseProvider implements Initializable {
	public database!: DatabaseAdapter;

	async initialize(): Promise<void> {
		const databaseType = config.getDatabaseType();

		switch (databaseType) {
			case 'kvd':
				this.database = new KVDatabaseAdapter();
				break;
			case 'mongo':
				this.database = new MongoDatabaseAdapter();
				break;
			default: {
				throw new Error(
					`Unknown database type: "${databaseType}" . Please set a valid value for "database_type" in config.yaml (allowed: "kvd", "mongo"). Plugin will be unloaded.`,
				);
			}
		}

		await this.database.connect();

		if (this.database.ensureCollectionExists) {
			await this.database.ensureCollectionExists('players');
		}
	}
}

export default new DatabaseProvider();
