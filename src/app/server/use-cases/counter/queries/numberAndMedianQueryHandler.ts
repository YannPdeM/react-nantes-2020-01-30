import { LibCache, LibQueryHandler } from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import {
	NumberOfCountersAndMedianOfAllQuery,
	NumberOfCountersAndMedianOfAllQueryName,
} from '../../../../common/domain/counter/queries/NumberOfCountersAndMedianOfAllQuery';
import { NumberOfCountersAndMedianOfAllViewModel } from '../../../../common/domain/counter/viewModels/numberOfCountersAndMedianOfAllViewModel';
import { none, Some, some, toNullable } from 'fp-ts/lib/Option';

export default (cache: LibCache): LibQueryHandler =>
	Object.assign(
		async (
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			query: NumberOfCountersAndMedianOfAllQuery
		): Promise<NumberOfCountersAndMedianOfAllViewModel> => {
			const numberOfCounters = parseInt(
				<string><unknown>(toNullable(await cache.get('numberAndMedian:number')) as {value: number}).value,
				10
			);
			const medianOfAll = (toNullable(await cache.get('numberAndMedian:median')) as {value:number}).value;
			return {
				version: none,
				value: <Some<{
					numberOfCounters: number;
					medianOfAll: number;
				}>>some({
					numberOfCounters,
					medianOfAll,
				})
			};
		},
		{
			listenTo: () => NumberOfCountersAndMedianOfAllQueryName,
		}
	);
