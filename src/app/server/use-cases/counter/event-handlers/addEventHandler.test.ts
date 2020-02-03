import addEventHandler from './addEventHandler';
import inMemoryCache from '../../../../../DDD_ES_Lib/infrastructure/InMemory/Cache/InMemoryCache';
import {
	CounterEventsNames,
	createCounterEvent,
} from '../../../../common/domain/counter/events/CounterEvents';
import { fold, Option, some } from 'fp-ts/lib/Option';
import { SingleCounterViewModel } from '../../../../common/domain/counter/viewModels/singleCounterViewModel';

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
		const t1:Option<SingleCounterViewModel> = await cache.get(`${firstCounterId}:lastValue`) as Option<SingleCounterViewModel>;
		expect(t1).toEqual(some({
			version: some(firstAddedEvent.version),
			value: some({
				id: firstAddedEvent.aggregateId,
				value: firstAddedEvent.payload,
			}),
		}));

		await aeh(secondAddedEvent);
		await aeh(thirdAddedEvent);

		const t2:Option<SingleCounterViewModel> = await cache.get(`${firstCounterId}:lastValue`) as Option<SingleCounterViewModel>;
		expect(t2).toEqual(some({
			version: some(secondAddedEvent.version),
			value: some({
				id: secondAddedEvent.aggregateId,
				value: some(fold<unknown, number>(
					() => 0,
					(a:number) => a
				)(firstAddedEvent.payload) + fold<unknown, number>(
					() => 0,
					(a:number) => a
				)(secondAddedEvent.payload)),
			}),
		}));


		const t3:Option<SingleCounterViewModel> = await cache.get(`${secondCounterId}:lastValue`) as Option<SingleCounterViewModel>;
		expect(t3).toEqual(some({
			version: some(thirdAddedEvent.version),
			value: some({
				id: thirdAddedEvent.aggregateId,
				value: thirdAddedEvent.payload,
			}),
		}));
	});

	it('listens to the specified events (plural, so array)', () => {
		expect(aeh.listenTo()).toEqual([CounterEventsNames.Added]);
	});

	it('skips if the given version is incorrect (this allow retries)', async () => {
		await aeh(firstAddedEvent);
		await aeh(secondAddedEvent);
		await aeh(thirdAddedEvent);

		const t4:Option<SingleCounterViewModel> = await cache.get(`${firstCounterId}:lastValue`) as Option<SingleCounterViewModel>;
		expect(t4).toEqual(some({
			version: some(secondAddedEvent.version),
			value: some({
				id: secondAddedEvent.aggregateId,
				value: some(fold<unknown, number>(() => 0, (a:number) => a)(firstAddedEvent.payload) + fold<unknown, number>(() => 0, (a:number) => a)(secondAddedEvent.payload)),
			}),
		}));

		const t5:Option<SingleCounterViewModel> = await cache.get(`${secondCounterId}:lastValue`) as Option<SingleCounterViewModel>;
		expect(t5).toEqual(some({
			version: some(thirdAddedEvent.version),
			value: some({
				id: thirdAddedEvent.aggregateId,
				value: thirdAddedEvent.payload,
			}),
		}));
	});
});
