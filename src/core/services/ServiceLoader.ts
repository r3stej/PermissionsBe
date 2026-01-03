import config from './Config';
import logHandler from './LogHandler';
import database from './database/DatabaseProvider';

import { Initializable } from './interfaces/Initializable';

export abstract class ServiceLoader {
	private static services: Initializable[] = [config, logHandler, database];

	static async loadServices(): Promise<void> {
		for (const service of this.services) {
			try {
				await service.initialize();
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				logger.fatal(`Service initialization failed: ${service.constructor.name}`);
				logger.error(msg);
				process.exit(1);
			}
		}
	}
}
