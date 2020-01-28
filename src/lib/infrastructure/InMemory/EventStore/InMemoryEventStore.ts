import {
	DomainEvent,
	LibEventStore,
	DomainId,
	DomainVersion,
} from '../../../DDD_ES/DDD_ES';

export default class InMemoryEventStore implements LibEventStore {
	streams: {};

	constructor() {
		this.streams = {};
	}

	async getEvents(
		aggregateId: DomainId,
		version: DomainVersion = 0
	): Promise<ReadonlyArray<DomainEvent>> {
		if (this.streams[aggregateId]) {
			const events = this.streams[aggregateId].filter(
				(event) => event.version >= version
			);
			return events.reverse();
		}

		return [];
	}

	getStream(aggregateId: DomainId): Array<DomainEvent> {
		let stream = this.streams[aggregateId];
		if (stream === undefined) {
			this.streams[aggregateId] = [];
			stream = this.streams[aggregateId];
		}
		return stream;
	}

	async getLastVersionOf(aggregateId: DomainId): Promise<DomainVersion> {
		const stream = this.getStream(aggregateId);
		return this.getLastVersion(stream);
	}

	getLastVersion(stream: ReadonlyArray<DomainEvent>): DomainVersion {
		return stream.length > 0 ? stream[0].version : -1;
	}

	static ensureWeAreAtTheRightVersion(
		lastVersion: DomainVersion,
		eventVersion: DomainVersion
	): void {
		if (eventVersion !== lastVersion + 1) {
			throw new Error('You are not up to date');
		}
	}

	async add(
		aggregateId: DomainId,
		expectedSaveVersion: DomainVersion,
		events: ReadonlyArray<DomainEvent>
	): Promise<void> {
		const stream = this.getStream(aggregateId);
		const lastVersion = this.getLastVersion(stream);

		InMemoryEventStore.ensureWeAreAtTheRightVersion(
			lastVersion,
			events[0].version
		);

		events.forEach((event) => {
			stream.unshift(event);
		});
	}
}
