import {
	DomainRepository,
	DomainId,
	LibEventStore,
	DomainVersion,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

import Counter from '../../../../common/domain/counter/Counter';
import { CounterEvent } from '../../../../common/domain/counter/events/CounterEvents';

interface SaveEventReturn {
	lastVersion: DomainVersion;
	lastState: Counter;
}
export default class CounterRepository
	implements DomainRepository<Counter, CounterEvent> {
	store: LibEventStore;

	constructor(eventStore: LibEventStore) {
		this.store = eventStore;
	}

	async getById(aggregateId: DomainId): Promise<Counter> {
		const events = (await this.store.getEvents(aggregateId)) as ReadonlyArray<
			CounterEvent
		>;
		const counter = new Counter({
			id: aggregateId,
			lastVersion: -1,
			value: 0,
		});
		counter.applyEvents(events);
		return counter;
	}

	async saveEvents(events): Promise<SaveEventReturn> {
		const counter = await this.getById(events[0].aggregateId);
		// TODO : to improve (performance wise primarily)
		events.forEach((ev) => {
			this.store.add(counter.id, ev.version, [ev]);
			counter.applyEvents([ev]);
		});
		return {
			lastVersion: counter.lastVersion,
			lastState: counter,
		};
	}
}
