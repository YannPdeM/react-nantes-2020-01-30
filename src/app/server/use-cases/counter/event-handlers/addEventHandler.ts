import {
	DomainId,
	DomainVersion,
	DomainVersionedViewModel,
	LibCache,
	LibEventHandler,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import {
	CounterEvent,
	CounterEventsNames,
} from '../../../../common/domain/counter/events/CounterEvents';
import { map, none, getOrElse, Option, isNone, getRight, toNullable, fold, Some, some } from 'fp-ts/lib/Option';
import { SingleCounterViewModel } from '../../../../common/domain/counter/viewModels/singleCounterViewModel';

export default (cache: LibCache): LibEventHandler =>
	Object.assign(
		async (event: CounterEvent): Promise<void> => {
			console.log({event})
			const key = `${event.aggregateId}:lastValue`;
			const inCache = (await cache.get(key)) as Option<SingleCounterViewModel>;

			let version: Option<DomainVersion>;
			let value: Some<number>;

			if(inCache === none) {
				version = some(event.version);
				value = event.payload;
			} else {
				const ic:Some<SingleCounterViewModel> = inCache as Some<SingleCounterViewModel>;
				const icValue:SingleCounterViewModel = ic.value;
				const previousVersion:Some<DomainVersion> = icValue.version;
				const previousVersionNumber:number = previousVersion.value;
				const previousValue:Some<{id: DomainId, value: Some<number>}> = icValue.value;
				const previousValueValue:{id: DomainId, value: Some<number>} = previousValue.value;
				const previousValueValueValue:Some<number> = previousValueValue.value;
				const previousNumber:number = previousValueValueValue.value;

				if(previousVersionNumber === event.version -1) {
					version = some(event.version);
					const eventValue = event.payload;
					value = some(eventValue.value + previousNumber) as Some<number>;
				}
			}

			if(version !== undefined && value !== undefined) {
				await cache.set(key, {
					version: some(event.version),
					value: some({
						id: event.aggregateId,
						value,
					}),
				});
			}
		},
		{
			listenTo: () => [CounterEventsNames.Added],
		}
	);
