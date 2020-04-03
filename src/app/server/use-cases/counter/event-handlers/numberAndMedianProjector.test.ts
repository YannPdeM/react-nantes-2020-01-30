import numberAndMedianProjector from './numberAndMedianProjector';
import inMemoryCache from '../../../../../DDD_ES_Lib/infrastructure/InMemory/Cache/InMemoryCache';
import {
	CounterEventsNames,
	createCounterEvent,
} from '../../../../common/domain/counter/events/CounterEvents';

describe('numberAndMedianProjector', () => {
	const firstCounterId = 'FIRST_COUNTER_ID';
	const secondCounterId = 'SECOND_COUNTER_ID';

	const firstAddedEvent = createCounterEvent({
		name: CounterEventsNames.Added,
		aggregateId: firstCounterId,
		version: 0,
		payload: 2,
	});
	const secondAddedEvent = createCounterEvent({
		name: CounterEventsNames.Added,
		aggregateId: secondCounterId,
		version: 0,
		payload: 3,
	});
	const thirdAddedEvent = createCounterEvent({
		name: CounterEventsNames.Added,
		aggregateId: firstCounterId,
		version: 1,
		payload: 4,
	});

	let aCache, aNamp;
	beforeEach(() => {
		aCache = inMemoryCache();
		aNamp = numberAndMedianProjector(aCache);
	});

	it('stores the number of counters', async () => {
		await aNamp(firstAddedEvent);

		const t1 = (await aCache.get(`numberAndMedian:number`)).value.value.value;
		expect(t1).toBe(1);

		await aNamp(secondAddedEvent);
		const t2 = (await aCache.get(`numberAndMedian:number`)).value.value.value;
		expect(t2).toBe(2);

		await aNamp(thirdAddedEvent);
		const t3 = (await aCache.get(`numberAndMedian:number`)).value.value.value;
		expect(t3).toBe(2);
	});

	it('stores the median of counters', async () => {
		await aNamp(firstAddedEvent);
		const t1 = (await aCache.get(`numberAndMedian:median`)).value.value.value;
		expect(t1).toBe(2);

		await aNamp(secondAddedEvent);
		const t2 = (await aCache.get(`numberAndMedian:median`)).value.value.value;
		expect(t2).toBe(2.5);

		await aNamp(thirdAddedEvent);
		const t3 = (await aCache.get(`numberAndMedian:median`)).value.value.value;
		expect(t3).toBe(4.5);
	});

	it('listens to the specified events (plural, so array)', () => {
		expect(aNamp.listenTo()).toEqual([
			CounterEventsNames.Added,
			CounterEventsNames.Subtracted,
			CounterEventsNames.Multiplied,
			CounterEventsNames.Divided,
		]);
	});
});
