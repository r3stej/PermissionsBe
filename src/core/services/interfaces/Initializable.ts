export interface Initializable {
	initialize(): void | Promise<void>;
}
