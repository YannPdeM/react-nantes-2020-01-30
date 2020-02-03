import numberAndMedianProjector from './numberAndMedianProjector';
import inMemoryCache from '../../../../../DDD_ES_Lib/infrastructure/InMemory/Cache/InMemoryCache';
import {
	CounterEventsNames,
	createCounterEvent,
} from '../../../../common/domain/counter/events/CounterEvents';
import { None, Some } from 'fp-ts/lib/Option';

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

	fit('stores the number of counters', async () => {
		await aNamp(firstAddedEvent);

		const t1: Some<{version:None, value:Some<number>}> = (await aCache.get(`numberAndMedian:number`));
		const t2:{version:None, value:Some<number>} = t1.value;
		const t3:Some<number> = t2.value;
		const t4:number = t3.value
		expect(t4).toBe(1);

		await aNamp(secondAddedEvent);
		expect(
			parseInt((await aCache.get(`numberAndMedian:number`)).value, 10)
		).toBe(2);

		await aNamp(thirdAddedEvent);
		expect(
			parseInt((await aCache.get(`numberAndMedian:number`)).value, 10)
		).toBe(2);
	});

	it('stores the median of counters', async () => {
		await aNamp(firstAddedEvent);
		expect(
			parseFloat((await aCache.get(`numberAndMedian:median`)).value)
		).toBe(2);

		await aNamp(secondAddedEvent);
		expect(
			parseFloat((await aCache.get(`numberAndMedian:median`)).value)
		).toBe(2.5);

		await aNamp(thirdAddedEvent);
		expect(
			parseFloat((await aCache.get(`numberAndMedian:median`)).value)
		).toBe(4.5);
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
