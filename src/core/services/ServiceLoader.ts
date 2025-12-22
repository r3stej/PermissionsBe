import config from './Config';
import logHandler from './LogHandler';

export abstract class ServiceLoader {
	private static services: Initializable[] = [config, logHandler];

	static loadServices(): void {
		for (const service of this.services) {
			service.initialize();
		}
	}
}
