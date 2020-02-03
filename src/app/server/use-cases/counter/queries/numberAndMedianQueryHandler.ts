import {
	LibCache,
	LibQueryHandler,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import {
	NumberOfCountersAndMedianOfAllQuery,
	NumberOfCountersAndMedianOfAllQueryName,
} from '../../../../common/domain/counter/queries/NumberOfCountersAndMedianOfAllQuery';
import { NumberOfCountersAndMedianOfAllViewModel } from '../../../../common/domain/counter/viewModels/numberOfCountersAndMedianOfAllViewModel';
import { None, none, Some, some } from 'fp-ts/lib/Option';

export default (cache: LibCache): LibQueryHandler =>
	Object.assign(
		async (
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			query: NumberOfCountersAndMedianOfAllQuery
		): Promise<NumberOfCountersAndMedianOfAllViewModel> => {
			const storedNumber = (await cache.get(
				'numberAndMedian:number'
			)) as Some<{ version: None; value: Some<number> }>;
			const storedNumberValue: { version: None; value: Some<number> } =
				storedNumber.value;
			const numberOfCounters = storedNumberValue.value.value;

			const storedMedian = (await cache.get(
				'numberAndMedian:median'
			)) as Some<{ version: None; value: Some<number> }>;
			const storedMedianValue: { version: None; value: Some<number> } =
				storedMedian.value;
			const medianOfAll = storedMedianValue.value.value;

			return {
				version: none,
				value: some({
					numberOfCounters,
					medianOfAll,
				}),
			};
		},
		{
			listenTo: () => NumberOfCountersAndMedianOfAllQueryName,
		}
	);
