import { LibCache, LibQueryHandler } from '../../../../../lib/DDD_ES/DDD_ES';
import {
	SingleCounterQuery,
	SingleCounterQueryName,
} from '../../../../common/domain/counter/queries/SingleCounterQuery';
import { SingleCounterViewModel } from '../../../../common/domain/counter/viewModels/singleCounterViewModel';

export default (cache: LibCache): LibQueryHandler =>
	Object.assign(
		async (query: SingleCounterQuery): Promise<SingleCounterViewModel> => {
			const { id: aggregateId } = query;

			const inCache = await cache.get(`${aggregateId}:lastValue`);

			return {
				version: inCache.version,
				value: {
					id: aggregateId,
					value: inCache.value,
				},
			};
		},
		{
			listenTo: () => SingleCounterQueryName,
		}
	);
