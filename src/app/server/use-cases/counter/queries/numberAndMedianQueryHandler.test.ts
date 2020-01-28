import numberAndMedianQueryHandler from './numberAndMedianQueryHandler';
import InMemoryCache from '../../../../../lib/infrastructure/InMemory/Cache/InMemoryCache';
import {
	NumberOfCountersAndMedianOfAllQuery,
	NumberOfCountersAndMedianOfAllQueryName,
} from '../../../../common/domain/counter/queries/NumberOfCountersAndMedianOfAllQuery';
import { NumberOfCountersAndMedianOfAllViewModel } from '../../../../common/domain/counter/viewModels/numberOfCountersAndMedianOfAllViewModel';

describe('a numberAndMedianQueryHandler', () => {
	const aCache = InMemoryCache();

	const aQuery: NumberOfCountersAndMedianOfAllQuery = {
		name: NumberOfCountersAndMedianOfAllQueryName,
	};

	const aNamqh = numberAndMedianQueryHandler(aCache);

	it('fetches the ViewModel from the Cache', async () => {
		await aCache.set(`numberAndMedian:number`, {
			value: 2,
		});
		await aCache.set(`numberAndMedian:median`, {
			value: 0.5,
		});

		const vm: NumberOfCountersAndMedianOfAllViewModel = await aNamqh(aQuery);

		expect(vm).toEqual({
			value: {
				numberOfCounters: 2,
				medianOfAll: 0.5,
			},
		});
	});

	it('listens to the specified query', () => {
		expect(aNamqh.listenTo()).toEqual(
			NumberOfCountersAndMedianOfAllQueryName
		);
	});
});
