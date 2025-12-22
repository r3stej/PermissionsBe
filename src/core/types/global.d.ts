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

declare interface Initializable {
	initialize(): void;
}
