import { LibCache, LibEventHandler } from '../../../../../lib/DDD_ES/DDD_ES';
import {
	CounterEvent,
	CounterEventsNames,
} from '../../../../common/domain/counter/events/CounterEvents';

export default (cache: LibCache): LibEventHandler =>
	Object.assign(
		async (event: CounterEvent): Promise<void> => {
			const { aggregateId, version, payload } = event;

			const key = `${aggregateId}:lastValue`;

			const inCache = await cache.get(key);

			if (inCache === undefined || inCache.version === version - 1) {
				const value = (inCache === undefined ? 0 : inCache.value) + payload;
				await cache.set(key, { version, value });
			}
		},
		{
			listenTo: () => [CounterEventsNames.Added],
		}
	);
