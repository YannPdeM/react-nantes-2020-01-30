import { Repository, id, EventStore, version } from '../../../../../lib/DDD_ES';

import Counter from '../../../../common/domain/counter/Counter';
import { CounterEvent } from '../../../../common/domain/counter/events/CounterEvents';

interface SaveEventReturn {
	lastVersion: version;
	lastState: Counter;
}
export default class CounterRepository
	implements Repository<Counter, CounterEvent> {
	store: EventStore;

	constructor(eventStore: EventStore) {
		this.store = eventStore;
	}

	getById(aggregateId: id): Counter {
		const events = this.store.getEvents(aggregateId) as ReadonlyArray<
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

	saveEvents(events): SaveEventReturn {
		const counter = this.getById(events[0].aggregateId);
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
