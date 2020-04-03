import CrudeOnDiskStorageEventStore from './CrudeOnDiskStorageEventStore';
import { DomainEvent, DomainId, DomainVersion } from '../../../DDD_ES/DDD_ES';

import { promises as fsPromises } from 'fs';
import { none, some } from 'fp-ts/lib/Option';

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
	payload: some({
		whatever: whatever || 'anything',
	}),
	meta: none,
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

	const REINIT_FILE = (content = '[]') => async (): Promise<void> => {
		await fsPromises.writeFile(filePath, content);
	};

	beforeEach(REINIT_FILE());
	afterEach(REINIT_FILE());

	it('stores', async () => {
		const eventStore = await CrudeOnDiskStorageEventStore.build(filePath);
		expect(await eventStore.getAllEvents()).toEqual([]);

		await eventStore.add(firstId, 0, [firstEvent, secondEvent]);
		await eventStore.add(secondId, 0, [thirdEvent]);
		await eventStore.add(firstId, 2, [fourthEvent]);
		await eventStore.add(secondId, 1, [fifthEvent]);

		expect(
			JSON.parse((await fsPromises.readFile(filePath)).toString())
		).toEqual(await eventStore.getAllEvents());
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

		const eventStore = await CrudeOnDiskStorageEventStore.build(filePath);
		expect(await eventStore.getAllEvents()).toEqual(events);
	});

	it('doesn’t choke an empty (for example: new) file', async () => {
		await fsPromises.unlink(filePath);

		const eventStore = await CrudeOnDiskStorageEventStore.build(filePath);
		expect(await eventStore.getAllEvents()).toEqual([]);
	});
});
