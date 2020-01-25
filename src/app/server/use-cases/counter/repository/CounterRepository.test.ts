import { createCounterEvent } from '../../../../common/domain/counter/events/CounterEvents';

import InMemoryEventStore from '../../../../../lib/infrastructure/InMemoryEventStore';
import CounterRepository from './CounterRepository';

import { v4 as uuid } from 'uuid';

describe('a CounterRepository', () => {
	const counterId = uuid();

	const firstEventEver = createCounterEvent({
		eventId: uuid(),
		name: 'ADDED',
		version: 0,
		timestamp: Date.now(),
		payload: 120,
		aggregateId: counterId,
	});
	const secondEvent = createCounterEvent({
		name: 'ADDED',
		version: firstEventEver.version + 1,
		payload: 3,
		aggregateId: counterId,
	});

	it('get us a counter up-to-date', async () => {
		const store = new InMemoryEventStore();
		const repo = new CounterRepository(store);

		await store.add(counterId, firstEventEver.version, [
			firstEventEver,
			secondEvent,
		]);

		const realCounter = await repo.getById(counterId);

		expect(realCounter.value).toBe(123);
	});

	it('saves events and return us a {lastVersion, lastState} object', async () => {
		const store = new InMemoryEventStore();
		const repo = new CounterRepository(store);

		const newCounter = await repo.getById(counterId);
		expect(newCounter).toMatchObject({
			id: counterId,
			lastVersion: -1, // no event yet
			value: 0,
			logger: expect.any(Object),
		});

		const {
			lastVersion,
			lastState: { id, lastVersion: counterLastVersion, value },
		} = await repo.saveEvents([firstEventEver, secondEvent]);
		expect(lastVersion).toBe(1);
		expect(id).toBe(counterId);
		expect(counterLastVersion).toBe(lastVersion);
		expect(value).toBe(123);
	});
});
