import InMemoryEventStore from './InMemoryEventStore';
import { DomainEvent } from '../../../DDD_ES/DDD_ES';

import { promises as fsPromises } from 'fs';

export class CrudeOnDiskStorageEventStore extends InMemoryEventStore {
	filePath: string;

	constructor(filePath: string) {
		super();
		console.warn(`
Please NEVER use \`CrudeOnDiskStorageEventStore\` in production:
- what we want is to write each new event in append-only file
- here we rewrite all the history at every event,
  which means each one will take longer than the previous
`);
		this.filePath = filePath;
	}

	async add(aggregateId: string, expectedSaveVersion: number, events: ReadonlyArray<DomainEvent>): Promise<void> {
		await super.add(aggregateId, expectedSaveVersion, events);
		await fsPromises.writeFile(this.filePath, JSON.stringify((await super.getAllEvents())));
	}

	async restore(): Promise<void> {
		const content = (await fsPromises.readFile(this.filePath)).toString();
		console.log({content})
		if(content !== '') {
			const events: ReadonlyArray<DomainEvent> = JSON.parse(content);
			events.forEach((event) => super.add(event.aggregateId, event.version, [event]));
		}
	}
}
export default async (filePath: string): Promise<CrudeOnDiskStorageEventStore> => {
	const instance = new CrudeOnDiskStorageEventStore(filePath);
	await instance.restore();
	return instance;
};
