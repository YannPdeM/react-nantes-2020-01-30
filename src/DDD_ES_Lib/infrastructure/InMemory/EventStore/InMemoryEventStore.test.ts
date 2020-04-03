import { DomainId, DomainVersion, DomainEvent } from '../../../DDD_ES/DDD_ES';
import InMemoryEventStore from './InMemoryEventStore';
import { some, none } from 'fp-ts/lib/Option';

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

describe('an event store', () => {
	it('gives us an empty array when there is corresponding aggregateId', async () => {
		const eventStore = new InMemoryEventStore();
		const events = await eventStore.getEvents('a_non_existing_aggregateId');
		expect(events).toEqual([]);
	});

	it('gives us all the aggregate’s events if no version is provided', async () => {
		const id = 'first_accumulator';
		const eventStore = new InMemoryEventStore();
		const event = SomethingHappenedEvent(id, 0, 'first event');
		await eventStore.add(id, event.version, [event]);
		const events = await eventStore.getEvents(id);
		expect(events).toEqual([event]);
	});

	it('gives us only the adequate events when a version is provided', async () => {
		const id = 'second_accumulator';
		const eventStore = new InMemoryEventStore();
		const firstEvent = SomethingHappenedEvent(id, 0, 'first event');
		const secondEvent = SomethingHappenedEvent(id, 1, 'second event');
		const thirdEvent = SomethingHappenedEvent(id, 2, 'third event');
		await eventStore.add(id, firstEvent.version, [
			firstEvent,
			secondEvent,
			thirdEvent,
		]);
		const events = await eventStore.getEvents(id, 1);
		expect(events).toEqual([secondEvent, thirdEvent]);
	});

	it('throws an exception when we try to added events at the wrong version', async () => {
		const id = 'third_accumulator';
		const eventStore = new InMemoryEventStore();
		const firstEvent = SomethingHappenedEvent(id, 0, 'first event');
		const secondEvent = SomethingHappenedEvent(id, 1, 'second event');
		const thirdEvent = SomethingHappenedEvent(id, 2, 'third event');
		const wrongEvent = SomethingHappenedEvent(id, 1, 'third event bis');
		await eventStore.add(id, firstEvent.version, [
			firstEvent,
			secondEvent,
			thirdEvent,
		]);
		try {
			await eventStore.add(id, wrongEvent.version, [wrongEvent]);
		} catch (e) {
			expect(e).toEqual(new Error('You are not up to date'));
		}
	});

	it('returns -1 as the last version of a yet unused aggregateId', async () => {
		const id = 'fourth_accumulator';
		const eventStore = new InMemoryEventStore();
		const lastVersion = await eventStore.getLastVersionOf(id);
		expect(lastVersion).toBe(-1);
	});

	it('returns the last version of a used aggregateId', async () => {
		const id = 'fifth_accumulator';

		const eventStore = new InMemoryEventStore();

		const getLastVersion = async (): Promise<DomainVersion> =>
			await eventStore.getLastVersionOf(id);

		expect(await getLastVersion()).toBe(-1);

		const firstEvent = SomethingHappenedEvent(id, 0, 'first event');
		await eventStore.add(id, firstEvent.version, [firstEvent]);
		expect(await getLastVersion()).toBe(firstEvent.version);

		const secondEvent = SomethingHappenedEvent(id, 1, 'second event');
		await eventStore.add(id, secondEvent.version, [secondEvent]);
		expect(await getLastVersion()).toBe(secondEvent.version);
	});

	it('returns all events by insertion order regardless of the aggregates', async () => {
		const firstId = 'sixth_accumulator';
		const secondId = 'seventh_accumulator';

		const eventStore = new InMemoryEventStore();

		const firstEvent = SomethingHappenedEvent(firstId, 0, 'first event');
		const secondEvent = SomethingHappenedEvent(firstId, 1, 'second event');

		const thirdEvent = SomethingHappenedEvent(secondId, 0, 'first event');

		const fourthEvent = SomethingHappenedEvent(firstId, 2, 'third event');

		const fifthEvent = SomethingHappenedEvent(secondId, 1, 'second event');

		await eventStore.add(firstId, 0, [firstEvent, secondEvent]);
		await eventStore.add(secondId, 0, [thirdEvent]);
		await eventStore.add(firstId, 2, [fourthEvent]);
		await eventStore.add(secondId, 1, [fifthEvent]);

		expect(await eventStore.getAllEvents()).toEqual([
			firstEvent,
			secondEvent,
			thirdEvent,
			fourthEvent,
			fifthEvent,
		]);
	});

	it('does nothing on restore', async () => {
		const id = 'eight_accumulator';
		const eventStore = new InMemoryEventStore();
		const event = SomethingHappenedEvent(id, 0, 'first event');
		await eventStore.add(id, event.version, [event]);
		const events = await eventStore.getEvents(id);
		expect(events).toEqual([event]);
		await eventStore.restore();
		expect(await eventStore.getAllEvents()).toEqual([event]);
	});
});
