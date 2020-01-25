import { id, version as DDDVersion, Event } from '../DDD_ES/DDD_ES';
import InMemoryEventStore from './InMemoryEventStore';

const SomethingHappenedEvent = (
	aggregateId: id,
	version: DDDVersion,
	whatever?: string
): Event => ({
	eventId: 'SOME_EVENT_ID',
	name: 'SOMETHING_HAPPENED',
	aggregateId: aggregateId,
	version: version,
	timestamp: Date.now(),
	payload: {
		whatever: whatever || 'anything',
	},
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
});
