import mongoose, { Connection } from 'mongoose';

import config from '../../../Config';
import DatabaseAdapter from '../../interfaces/DatabaseAdapter';
import Player from './models/playerModel';
import Group from './models/groupModel';

export class MongoDatabaseAdapter implements DatabaseAdapter {
	private readonly databaseUri: string = config.getDatabaseUri();
	private readonly databaseName: string = config.getDatabaseName();
	private database!: NonNullable<Connection['db']>;

	async connect(): Promise<void> {
		await mongoose.connect(this.databaseUri, {
			dbName: this.databaseName,
		});

		if (!mongoose.connection.db) {
			throw new Error('Mongo connection established but database is undefined');
		}

		this.database = mongoose.connection.db;

		logger.info(
			`MongoDB connected: ${mongoose.connection.host}:${mongoose.connection.port} (database: ${mongoose.connection.name})`,
		);
	}

	async ensureCollectionExists(name: string): Promise<void> {
		const exists = await this.database.listCollections({ name }).hasNext();

		if (exists) return;

		await this.database.createCollection('players');
		logger.info(`${name} collection has been created.`);
	}
}
