import { LibCache, LibQueryHandler } from '../../../../../lib/DDD_ES/DDD_ES';
import {
	NumberOfCountersAndMedianOfAllQuery,
	NumberOfCountersAndMedianOfAllQueryName,
} from '../../../../common/domain/counter/queries/NumberOfCountersAndMedianOfAllQuery';
import { NumberOfCountersAndMedianOfAllViewModel } from '../../../../common/domain/counter/viewModels/numberOfCountersAndMedianOfAllViewModel';

export default (cache: LibCache): LibQueryHandler =>
	Object.assign(
		async (
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			query: NumberOfCountersAndMedianOfAllQuery
		): Promise<NumberOfCountersAndMedianOfAllViewModel> => {
			const numberOfCounters = parseInt(
				(await cache.get('numberAndMedian:number')).value,
				10
			);
			const medianOfAll = (await cache.get('numberAndMedian:median')).value;
			return {
				value: {
					numberOfCounters,
					medianOfAll,
				},
			};
		},
		{
			listenTo: () => NumberOfCountersAndMedianOfAllQueryName,
		}
	);
