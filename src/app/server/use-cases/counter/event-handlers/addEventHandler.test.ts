import addEventHandler from './addEventHandler';
import inMemoryCache from '../../../../../lib/infrastructure/InMemory/Cache/InMemoryCache';
import {
	CounterEventsNames,
	createCounterEvent,
} from '../../../../common/domain/counter/events/CounterEvents';

describe('addEventHandler', () => {
	const firstCounterId = 'FIRST_COUNTER_ID';
	const secondCounterId = 'SECOND_COUNTER_ID';

	const cache = inMemoryCache();
	const aeh = addEventHandler(cache);

	const firstAddedEvent = createCounterEvent({
		name: CounterEventsNames.Added,
		aggregateId: firstCounterId,
		version: 0,
		payload: 123,
	});
	const secondAddedEvent = createCounterEvent({
		name: CounterEventsNames.Added,
		aggregateId: firstCounterId,
		version: 1,
		payload: 456,
	});
	const thirdAddedEvent = createCounterEvent({
		name: CounterEventsNames.Added,
		aggregateId: secondCounterId,
		version: 0,
		payload: 321,
	});

	it('stores the last version and value', async () => {
		await aeh(firstAddedEvent);
		expect(await cache.get(`${firstCounterId}:lastValue`)).toEqual({
			version: firstAddedEvent.version,
			value: firstAddedEvent.payload,
		});

		await aeh(secondAddedEvent);
		await aeh(thirdAddedEvent);

		expect(await cache.get(`${firstCounterId}:lastValue`)).toEqual({
			version: secondAddedEvent.version,
			value: firstAddedEvent.payload + secondAddedEvent.payload,
		});

		expect(await cache.get(`${secondCounterId}:lastValue`)).toEqual({
			version: thirdAddedEvent.version,
			value: thirdAddedEvent.payload,
		});
	});

	it('listens to the specified events (plural, so array)', () => {
		expect(aeh.listenTo()).toEqual([CounterEventsNames.Added]);
	});

	it('skips if the given version is incorrect (this allow retries)', async () => {
		await aeh(firstAddedEvent);
		await aeh(secondAddedEvent);
		await aeh(thirdAddedEvent);

		expect(await cache.get(`${firstCounterId}:lastValue`)).toEqual({
			version: secondAddedEvent.version,
			value: firstAddedEvent.payload + secondAddedEvent.payload,
		});

		expect(await cache.get(`${secondCounterId}:lastValue`)).toEqual({
			version: thirdAddedEvent.version,
			value: thirdAddedEvent.payload,
		});
	});
});
