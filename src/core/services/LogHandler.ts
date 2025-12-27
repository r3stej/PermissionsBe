import fs from 'fs';
import path from 'path';

import config from './Config';
import { Initializable } from './interfaces/Initializable';

class LogHandler implements Initializable {
	public initialize(): void {
		if (config.getConsoleLogLevel() < 5 || config.getConsoleLogLevel() > 0) {
			logger.setLogLevel(config.getConsoleLogLevel());
			logger.setConsole(true, config.getConsoleLogLevel());
			logger.info(`Console log level set to: ${config.getConsoleLogLevel()}`);
		} else {
			logger.error(`Console log level: ${config.getConsoleLogLevel()} is not valid! Choose correct log level type between 0-4`);
		}

		if (!config.isLogFileEnabled()) {
			logger.info('File logging disabled');
			return;
		}

		try {
			if (!fs.existsSync(config.getLogDirectoryPath())) {
				throw new Error(`Log directory '${config.getLogDirectoryPath()}' does not exist!`);
			}

			const stats = fs.statSync(config.getLogDirectoryPath());

			if (!stats.isDirectory()) {
				throw new Error(`'${config.getLogDirectoryPath()}' is not a directory!`);
			}

			fs.accessSync(config.getLogDirectoryPath(), fs.constants.W_OK);

			const logFile = `permissionsbe_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.log`;
			const fullLogPath = path.join(config.getLogDirectoryPath(), logFile);

			logger.setFile(fullLogPath, 4);
			logger.info(`File logging enabled. Path: ${fullLogPath}`);
		} catch (error) {
			if (error instanceof Error) logger.error(error.message);
			else logger.error('Unknown file logging error');
		}
	}
}

export default new LogHandler();
