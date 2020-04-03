import {
	DomainId,
	LibCache,
	LibEventHandler,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import {
	CounterEvent,
	CounterEventsNames,
} from '../../../../common/domain/counter/events/CounterEvents';
import { getOrElse, None, none, Option, Some, some } from 'fp-ts/lib/Option';

export default (cache: LibCache): LibEventHandler => {
	const countersMap: Map<DomainId, number> = new Map();

	return Object.assign(
		async (event: CounterEvent): Promise<void> => {
			const counterIdsInCache = (await cache.get(
				'numberAndMedian:counterIds'
			)) as Option<{ version: None; value: Some<string> }>;

			let counterIds: Set<DomainId>;
			if (counterIdsInCache === none) {
				counterIds = new Set();
			} else {
				const SomeCounterIdsInCache = counterIdsInCache as Some<{
					version: None;
					value: Some<string>;
				}>;
				const SomeCounterIdsInCacheValue: {
					version: None;
					value: Some<string>;
				} = SomeCounterIdsInCache.value;
				const SomeCounterIdsInCacheValueValue: Some<string> =
					SomeCounterIdsInCacheValue.value;
				const SomeCounterIdsInCacheValueValueValue: string =
					SomeCounterIdsInCacheValueValue.value;
				counterIds = new Set(
					JSON.parse(SomeCounterIdsInCacheValueValueValue)
				);
			}
			counterIds.add(event.aggregateId);

			const t = countersMap.get(event.aggregateId);
			const lastValue = t === undefined ? 0 : t;
			countersMap.set(
				event.aggregateId,
				lastValue + getOrElse(() => 0)(event.payload)
			);

			let total = 0;
			countersMap.forEach((value) => {
				total += value;
			});
			const median = total / counterIds.size;

			await cache.set('numberAndMedian:counterIds', {
				value: some(JSON.stringify(Array.from(counterIds))),
				version: none,
			});
			await cache.set('numberAndMedian:number', {
				value: some(counterIds.size),
				version: none,
			});
			await cache.set('numberAndMedian:median', {
				value: some(median),
				version: none,
			});
		},
		{
			listenTo: (): ReadonlyArray<CounterEventsNames> => [
				CounterEventsNames.Added,
				CounterEventsNames.Subtracted,
				CounterEventsNames.Multiplied,
				CounterEventsNames.Divided,
			],
		}
	);
};
