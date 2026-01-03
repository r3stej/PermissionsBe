interface DatabaseAdapter {
	connect(): Promise<void>;
	ensureCollectionExists?(name: string): Promise<void>;
}

export default DatabaseAdapter;
