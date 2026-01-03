import DatabaseAdapter from '../../interfaces/DatabaseAdapter';
import Player from './types/PlayerEntry';
import Group from './types/GroupEntry';

export class KVDatabaseAdapter implements DatabaseAdapter {
	private playersDatabase: KVDatabase;
	private groupsDatabase: JsonConfigFile;

	constructor() {
		this.playersDatabase = new KVDatabase('./plugins/permissionsbe/data/players');
		this.groupsDatabase = new JsonConfigFile('./plugins/permissionsbe/config/groups.json');
	}

	async connect(): Promise<void> {
		logger.info('KVD database is available (local LSE instance).'); // local instance of KVD database is always available (provided by LSE environment).
	}
}
