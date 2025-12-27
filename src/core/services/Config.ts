import fs from 'fs';
import path from 'path';

import YAML from 'yaml';

import { Initializable } from './interfaces/Initializable';

class Config implements Initializable {
	private readonly configPath: string = path.join(process.cwd(), 'plugins', 'permissionsbe', 'config.yaml');
	private configData!: YAML.Document.Parsed;

	public initialize(): void {
		if (fs.existsSync(this.configPath)) {
			this.configData = YAML.parseDocument(fs.readFileSync(this.configPath, 'utf-8'));
			this.validateConfig();
			logger.info('Config file has been loaded.');
		} else {
			this.configData = this.initDefaultConfig();
			logger.info('Config file not found — a new one has been created.');
			this.validateConfig();
			this.saveFile();
		}
	}

	public getPrefix(): string {
		return this.configData.get('plugin_prefix') as string;
	}

	public getConsoleLogLevel(): number {
		return this.configData.get('console_log_level') as number;
	}

	public isLogFileEnabled(): boolean {
		return this.configData.get('content_log_file_enabled') as boolean;
	}

	public getLogDirectoryPath(): string {
		return this.configData.get('log_directory_path') as string;
	}

	public saveFile(): void {
		fs.writeFileSync(this.configPath, this.configData.toString(), 'utf-8');
	}

	private checkValueType(configKey: string, expectedType: string): unknown {
		const value = this.configData.get(configKey);
		return typeof value === expectedType ? value : undefined;
	}

	private validateConfig(): void {
		if (this.configData.errors.length) {
			logger.fatal(
				`YAML config file is broken: ${this.configData.errors.map(e => e.message).join('\n')}`,
				`Plugin can't work without valid config and will be unloaded. Please check config.yaml file - you can restore default config file by removing it and restarting server.`,
			);
			process.exit(1);
		}

		const config: Array<{ key: string; valueType: unknown }> = [
			{ key: 'plugin_prefix', valueType: this.checkValueType('plugin_prefix', 'string') },
			{ key: 'console_log_level', valueType: this.checkValueType('console_log_level', 'number') },
			{ key: 'content_log_file_enabled', valueType: this.checkValueType('content_log_file_enabled', 'boolean') },
			{ key: 'log_directory_path', valueType: this.checkValueType('log_directory_path', 'string') },
		];

		const defaultConfig = this.initDefaultConfig();
		let wasCorrected = false;

		config.forEach(({ key, valueType }) => {
			if (valueType === undefined) {
				logger.warn(`Missing or invalid config: ${key}`);

				const defaultValue = defaultConfig.get(key);

				if (defaultValue === undefined) {
					logger.fatal(
						`Default config missing key: ${key}`,
						`Plugin can't work without valid config and will be unloaded. Please check Config.initDefaultConfig() method.`,
					);
					process.exit(1);
				}

				this.configData.set(key, defaultValue);
				wasCorrected = true;
				logger.warn(`Default value has been set for key: ${key}`);
			}
		});

		if (wasCorrected) this.saveFile();

		logger.info('Config has been validated.');
	}

	private initDefaultConfig(): YAML.Document.Parsed {
		const content = YAML.parseDocument(
			`#---------------------------------------------------------------#\n#Please do not add/remove any keys and do not leave empty values!\n#---------------------------------------------------------------#\n\n#Plugin prefix will be displayed in server messages related to plugin action\nplugin_prefix: "[PermissionsBe]"\n\n#Minimum log level displayed in console (0-Silent, 1-Fatal, 2-Error, 3-Warn, 4-Info)\nconsole_log_level: 3\n\n#Collect logs to a file\ncontent_log_file_enabled: false\n\n#Indicate the path where the logs should be stored. File with permissionsbe_YYYYMMDD.log format will be created\nlog_directory_path: "<your_path_to_levilamina>/logs"`,
		);

		if (content.errors.length) {
			logger.fatal(
				`YAML default config content is broken: ${content.errors.map(e => e.message).join('\n')}`,
				`Please check Config.initDefaultConfig() method. Plugin will be unloaded.`,
			);
			process.exit(1);
		}

		return content;
	}
}

export default new Config();
