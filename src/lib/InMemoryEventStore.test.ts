import { id, version, Event } from './DDD_ES';
import InMemoryEventStore from './InMemoryEventStore';

const addedEvent = (
	aggregateId: id,
	version: version,
	quantity: number
): Event => ({
	eventId: 'SOME_EVENT_ID',
	name: 'ADDED',
	aggregateId: aggregateId,
	version: version,
	timestamp: Date.now(),
	payload: {
		qty: quantity,
	},
});

describe('an event store', () => {
	it('gives us an empty array when there is corresponding aggregateId', () => {
		const acc = new InMemoryEventStore();
		const evs = acc.getEvents('a_non_existing_aggregateId');
		expect(evs).toEqual([]);
	});

	it('gives us all the aggregate’s events if no version is provided', () => {
		const id = 'first_accumulator';
		const acc = new InMemoryEventStore();
		const addEv = addedEvent(id, 0, 1);
		acc.add(id, addEv.version, [addEv]);
		const evs = acc.getEvents(id);
		expect(evs).toEqual([addEv]);
	});

	it('gives us only the adequate events when a version is provided', () => {
		const id = 'second_accumulator';
		const acc = new InMemoryEventStore();
		const firstAddEv = addedEvent(id, 0, 1);
		const secondAddEv = addedEvent(id, 1, 2);
		const thirdAddEv = addedEvent(id, 2, 3);
		acc.add(id, firstAddEv.version, [firstAddEv, secondAddEv, thirdAddEv]);
		const evs = acc.getEvents(id, 1);
		expect(evs).toEqual([secondAddEv, thirdAddEv]);
	});

	it('throws an exception when we try to added events at the wrong version', () => {
		const id = 'third_accumulator';
		const acc = new InMemoryEventStore();
		const firstAddEv = addedEvent(id, 0, 1);
		const secondAddEv = addedEvent(id, 1, 2);
		const thirdAddEv = addedEvent(id, 2, 3);
		const wrongEvent = addedEvent(id, 1, 4);
		acc.add(id, firstAddEv.version, [firstAddEv, secondAddEv, thirdAddEv]);
		expect(() => {
			acc.add(id, wrongEvent.version, [wrongEvent]);
		}).toThrow('You are not up to date');
	});
});
