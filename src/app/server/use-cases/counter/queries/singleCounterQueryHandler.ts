import {
	DomainId,
	DomainVersion,
	LibCache,
	LibQueryHandler,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import {
	SingleCounterQuery,
	SingleCounterQueryName,
} from '../../../../common/domain/counter/queries/SingleCounterQuery';
import { SingleCounterViewModel } from '../../../../common/domain/counter/viewModels/singleCounterViewModel';
import { Some, some } from 'fp-ts/lib/Option';

export default (cache: LibCache): LibQueryHandler =>
	Object.assign(
		async (query: SingleCounterQuery): Promise<SingleCounterViewModel> => {
			const { id: aggregateId } = query;

			const inCache = (await cache.get(`${aggregateId}:lastValue`)) as Some<{
				version: Some<DomainVersion>;
				value: Some<number>;
			}>;
			return {
				version: inCache.value.version as Some<number>,
				value: some({
					id: aggregateId,
					value: inCache.value.value as Some<number>,
				}) as Some<{ id: DomainId; value: Some<number> }>,
			};
		},
		{
			listenTo: () => SingleCounterQueryName,
		}
	);
