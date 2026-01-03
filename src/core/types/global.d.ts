declare function log(...data: unknown[]): void;
declare function colorLog(color: string, ...data: unknown[]): void;

declare const logger: {
	setConsole(isOpen: boolean, logLevel?: number): void;
	setFile(filepath: string, logLevel?: number): void;
	setLogLevel(level: number): void;
	log(...data: unknown[]): void;
	info(...data: unknown[]): void;
	warn(...data: unknown[]): void;
	error(...data: unknown[]): void;
	fatal(...data: unknown[]): void;
	setTitle(title: string): void;
};

declare type KVPrimitive = number | string | boolean | null;
declare type KVValue = KVPrimitive | KVValue[] | { [key: string]: KVValue };

declare class KVDatabase {
	constructor(dir: string);
	set(name: string, data: KVValue): boolean;
	get(name: string): KVValue | null;
	delete(name: string): boolean;
	listKey(): string[];
	close(): boolean;
}

declare type JsonPrimitive = string | number | boolean | null;
declare type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

declare class JsonConfigFile {
	constructor(path: string, defaultContent?: string);
	init<T extends JsonValue>(name: string, defaultValue: T): T;
	set(name: string, data: JsonValue): boolean;
	get<T extends JsonValue>(name: string, defaultValue?: T): T | null;
	delete(name: string): boolean;
}
