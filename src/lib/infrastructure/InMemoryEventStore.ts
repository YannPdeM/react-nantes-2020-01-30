import { Event, EventStore, version } from '../DDD_ES/DDD_ES';

export default class InMemoryEventStore implements EventStore {
	streams: {};

	constructor() {
		this.streams = {};
	}

	async getEvents(aggregateId, version = 0): Promise<ReadonlyArray<Event>> {
		if (this.streams[aggregateId]) {
			const events = this.streams[aggregateId].filter(
				(event) => event.version >= version
			);
			return events.reverse();
		}

		return [];
	}

	getStream(aggregateId): Array<Event> {
		let stream = this.streams[aggregateId];
		if (stream === undefined) {
			this.streams[aggregateId] = [];
			stream = this.streams[aggregateId];
		}
		return stream;
	}

	getLastVersion(stream): version {
		return stream.length > 0 ? stream[0].version : -1;
	}

	static ensureWeAreAtTheRightVersion(lastVersion, eventVersion): void {
		if (eventVersion !== lastVersion + 1) {
			throw new Error('You are not up to date');
		}
	}

	async add(aggregateId, expectedSaveVersion, events): Promise<void> {
		const stream = this.getStream(aggregateId);
		const lastVersion = this.getLastVersion(stream);

		InMemoryEventStore.ensureWeAreAtTheRightVersion(
			lastVersion,
			events[0].version
		);

		events.forEach((event) => {
			stream.unshift(event);
		});

		return;
	}
}
