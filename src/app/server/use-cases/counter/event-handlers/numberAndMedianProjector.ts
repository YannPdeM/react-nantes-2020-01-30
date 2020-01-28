import {
	DomainId,
	LibCache,
	LibEventHandler,
} from '../../../../../lib/DDD_ES/DDD_ES';
import {
	CounterEvent,
	CounterEventsNames,
} from '../../../../common/domain/counter/events/CounterEvents';

export default (cache: LibCache): LibEventHandler => {
	const countersMap: Map<DomainId, number> = new Map();

	return Object.assign(
		async (event: CounterEvent): Promise<void> => {
			const counterIdsInCache = await cache.get(
				'numberAndMedian:counterIds'
			);
			const counterIds: Set<DomainId> = new Set(
				counterIdsInCache?.value === undefined
					? []
					: JSON.parse(counterIdsInCache.value)
			);
			counterIds.add(event.aggregateId);

			const t = countersMap.get(event.aggregateId);
			const lastValue = t === undefined ? 0 : t;
			countersMap.set(event.aggregateId, lastValue + event.payload);

			let total = 0;
			countersMap.forEach((value) => {
				total += value;
			});

			const median = total / counterIds.size;

			await cache.set('numberAndMedian:counterIds', {
				value: JSON.stringify(Array.from(counterIds)),
			});
			await cache.set('numberAndMedian:number', {
				value: counterIds.size,
			});
			await cache.set('numberAndMedian:median', {
				value: median,
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
