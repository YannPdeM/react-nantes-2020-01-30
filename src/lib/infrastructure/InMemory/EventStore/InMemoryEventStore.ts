import {
	DomainEvent,
	LibEventStore,
	DomainId,
	DomainVersion,
} from '../../../DDD_ES/DDD_ES';

export default class InMemoryEventStore implements LibEventStore {
	events: Array<DomainEvent>;
	streams: Map<DomainId, Array<DomainEvent>>;

	constructor() {
		this.events = [];
		this.streams = new Map();
	}

	static filterEventsByVersion(
		events: ReadonlyArray<DomainEvent>,
		version: DomainVersion
	): ReadonlyArray<DomainEvent> {
		let currentIndex = 0;
		const response = [];
		while (
			currentIndex <= events.length - 1 &&
			events[currentIndex].version >= version
		) {
			response.unshift(events[currentIndex]);
			currentIndex += 1;
		}
		return response;
	}

	static getLastAggregateVersion = (
		stream: ReadonlyArray<DomainEvent>
	): DomainVersion => {
		return stream.length > 0 ? stream[0].version : -1;
	};

	static ensureWeAreAtTheRightVersion(
		lastVersion: DomainVersion,
		eventVersion: DomainVersion
	): void {
		if (eventVersion !== lastVersion + 1) {
			throw new Error('You are not up to date');
		}
	}

	async getEvents(
		aggregateId: DomainId,
		version: DomainVersion = 0
	): Promise<ReadonlyArray<DomainEvent>> {
		const streamEvents = this.streams.get(aggregateId);
		if (streamEvents === undefined) {
			return [];
		} else if (version === 0) {
			// default value
			return [...streamEvents].reverse();
		} else {
			return InMemoryEventStore.filterEventsByVersion(streamEvents, version);
		}
	}

	async add(
		aggregateId: DomainId,
		expectedSaveVersion: DomainVersion,
		events: ReadonlyArray<DomainEvent>
	): Promise<void> {
		let stream = this.streams.get(aggregateId);
		if (stream === undefined) {
			stream = [];
			this.streams.set(aggregateId, stream);
		}

		const lastVersion = InMemoryEventStore.getLastAggregateVersion(stream);
		InMemoryEventStore.ensureWeAreAtTheRightVersion(
			lastVersion,
			events[0].version
		);

		events.forEach((event) => {
			this.events.push(event);
			stream.unshift(event);
		});
	}

	async getLastVersionOf(aggregateId: DomainId): Promise<DomainVersion> {
		const stream = this.streams.get(aggregateId) || [];
		return InMemoryEventStore.getLastAggregateVersion(stream);
	}

	async getAllEvents(): Promise<ReadonlyArray<DomainEvent>> {
		console.log('getAllEvents');
		console.log({...this});
		console.log({'Array.isArray(this.events)': Array.isArray(this.events)});
		return this.events;
	}

	async restore(): Promise<void> {
		// no meaning for this class
	}
}
