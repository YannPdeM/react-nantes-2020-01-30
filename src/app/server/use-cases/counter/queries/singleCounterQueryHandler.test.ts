import singleCounterQueryHandler from './singleCounterQueryHandler';
import InMemoryCache from '../../../../../DDD_ES_Lib/infrastructure/InMemory/Cache/InMemoryCache';
import {
	SingleCounterQuery,
	SingleCounterQueryName,
} from '../../../../common/domain/counter/queries/SingleCounterQuery';
import { SingleCounterViewModel } from '../../../../common/domain/counter/viewModels/singleCounterViewModel';
import { some, Some } from 'fp-ts/lib/Option';
import { DomainId } from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

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
			version: some(0) as Some<number>,
			value: some(1234),
		});

		const vm = (await aScqh(aQuery)) as SingleCounterViewModel;
		const expected: SingleCounterViewModel = {
			version: some(0) as Some<number>,
			value: some({
				id: anAggregateId,
				value: some(1234) as Some<number>,
			}) as Some<{ id: DomainId; value: Some<number> }>,
		};
		expect(vm).toEqual(expected);
	});

	it('listens to the specified query', () => {
		expect(aScqh.listenTo()).toEqual(SingleCounterQueryName);
	});
});
