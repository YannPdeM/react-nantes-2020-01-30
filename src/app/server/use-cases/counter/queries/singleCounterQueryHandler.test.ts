import singleCounterQueryHandler from './singleCounterQueryHandler';
import InMemoryCache from '../../../../../lib/infrastructure/InMemory/Cache/InMemoryCache';
import {
	SingleCounterQuery,
	SingleCounterQueryName,
} from '../../../../common/domain/counter/queries/SingleCounterQuery';
import { SingleCounterViewModel } from '../../../../common/domain/counter/viewModels/singleCounterViewModel';

describe('a singleCounterQueryHandler', () => {
	const anAggregateId = 'AN_AGGREGATE_ID';
	const aCache = InMemoryCache();

	const aQuery: SingleCounterQuery = {
		name: SingleCounterQueryName,
		id: anAggregateId,
	};

	const aScqh = singleCounterQueryHandler(aCache);

	it('fetches the ViewModel from the Cache', async () => {
		await aCache.set(`${anAggregateId}:lastValue`, {
			version: 0,
			value: 1234,
		});

		const vm = (await aScqh(aQuery)) as SingleCounterViewModel;

		expect(vm).toEqual({
			version: 0,
			value: {
				id: anAggregateId,
				value: 1234,
			},
		});
	});

	it('listens to the specified query', () => {
		expect(aScqh.listenTo()).toEqual(SingleCounterQueryName);
	});
});
