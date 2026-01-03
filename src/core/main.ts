import { ServiceLoader } from './services/ServiceLoader';

async function main() {
	await ServiceLoader.loadServices();
}

main();
