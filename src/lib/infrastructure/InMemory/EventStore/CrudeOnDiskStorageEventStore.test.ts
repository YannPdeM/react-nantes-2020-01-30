import newCrudeOnDiskStorageEventStore from './CrudeOnDiskStorageEventStore';
import { createDomainEvent, DomainEvent, DomainId, DomainVersion } from '../../../DDD_ES/DDD_ES';

import { promises as fsPromises } from 'fs';
import InMemoryEventStore from './InMemoryEventStore';

const SomethingHappenedEvent = (
	aggregateId: DomainId,
	version: DomainVersion,
	whatever?: string
): DomainEvent => ({
	eventId: 'SOME_EVENT_ID',
	name: 'SOMETHING_HAPPENED',
	aggregateId: aggregateId,
	version: version,
	timestamp: Date.now(),
	payload: {
		whatever: whatever || 'anything',
	},
});

describe('a CrudeOnDiskStorageEventStore', () => {
	const filePath = './tmp/test-event-store.json';

	const firstId = 'FIRST_ID';
	const secondId = 'SECOND_ID';

	const firstEvent = SomethingHappenedEvent(firstId, 0, 'first event');
	const secondEvent = SomethingHappenedEvent(firstId, 1, 'second event');

	const thirdEvent = SomethingHappenedEvent(secondId, 0, 'first event');

	const fourthEvent = SomethingHappenedEvent(firstId, 2, 'third event');

	const fifthEvent = SomethingHappenedEvent(secondId, 1, 'second event');

	const REINIT_FILE = async () => {
		await fsPromises.writeFile(filePath, '[]');
	};

	beforeEach(REINIT_FILE);
	afterEach(REINIT_FILE);

	it('stores', async () => {
		const eventStore = await newCrudeOnDiskStorageEventStore(filePath);
		expect(await eventStore.getAllEvents()).toEqual([]);

		await eventStore.add(firstId, 0, [firstEvent, secondEvent]);
		await eventStore.add(secondId, 0, [thirdEvent]);
		await eventStore.add(firstId, 2, [fourthEvent]);
		await eventStore.add(secondId, 1, [fifthEvent]);

		const fileContent = await fsPromises.readFile(filePath);
		const t1 = fileContent.toString();
		const t2 = JSON.parse(t1);

		console.log({ fileContent, t1, t2 });
		expect(t2).toEqual(await eventStore.getAllEvents());
	});

	it('restores', async () => {
		const events = [
			firstEvent,
			secondEvent,
			thirdEvent,
			fourthEvent,
			fifthEvent,
		];
		await fsPromises.writeFile(filePath, JSON.stringify(events));

		const eventStore = await newCrudeOnDiskStorageEventStore(filePath);
		expect(await eventStore.getAllEvents()).toEqual(events);
	});
});
