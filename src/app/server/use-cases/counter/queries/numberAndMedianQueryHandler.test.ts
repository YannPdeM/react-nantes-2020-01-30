import numberAndMedianQueryHandler from './numberAndMedianQueryHandler';
import InMemoryCache from '../../../../../DDD_ES_Lib/infrastructure/InMemory/Cache/InMemoryCache';
import {
	NumberOfCountersAndMedianOfAllQuery,
	NumberOfCountersAndMedianOfAllQueryName,
} from '../../../../common/domain/counter/queries/NumberOfCountersAndMedianOfAllQuery';
import { NumberOfCountersAndMedianOfAllViewModel } from '../../../../common/domain/counter/viewModels/numberOfCountersAndMedianOfAllViewModel';
import { none, some } from 'fp-ts/lib/Option';

describe('a numberAndMedianQueryHandler', () => {
	const aCache = InMemoryCache();

	const aQuery: NumberOfCountersAndMedianOfAllQuery = {
		name: NumberOfCountersAndMedianOfAllQueryName,
	};

	const aNamqh = numberAndMedianQueryHandler(aCache);

	it('fetches the ViewModel from the Cache', async () => {
		await aCache.set(`numberAndMedian:number`, {
			value: some(2),
			version: none,
		});
		await aCache.set(`numberAndMedian:median`, {
			value: some(0.5),
			version: none,
		});

		const vm = (await aNamqh(
			aQuery
		)) as NumberOfCountersAndMedianOfAllViewModel;
		const expected: NumberOfCountersAndMedianOfAllViewModel = {
			version: none,
			value: some({
				numberOfCounters: 2,
				medianOfAll: 0.5,
			}),
		};
		expect(vm).toEqual(expected);
	});

	it('listens to the specified query', () => {
		expect(aNamqh.listenTo()).toEqual(
			NumberOfCountersAndMedianOfAllQueryName
		);
	});
});
