import { Event, id, version, timestamp } from '../../../../../lib/DDD_ES';

import { v4 as uuid } from 'uuid';

type CounterEventsNames = 'ADDED' | 'SUBTRACTED' | 'MULTIPLIED' | 'DIVIDED';
interface HappyCounterEvent extends Event {
	name: CounterEventsNames;
	payload: number;
}
interface SadCounterEvent extends Event {
	name: 'ERROR';
	payload: string;
}

// We could use a functional type for errors here
export type CounterEvent = HappyCounterEvent | SadCounterEvent;

export const createCounterEvent = ({
	eventId = uuid(),
	name,
	aggregateId,
	version,
	timestamp = Date.now(),
	payload,
	meta,
}: {
	eventId?: id;
	name: CounterEventsNames;
	aggregateId: id;
	version: version;
	timestamp?: timestamp;
	payload: number;
	meta?: any;
}): CounterEvent => ({
	eventId,
	name,
	aggregateId,
	version,
	timestamp,
	payload,
	meta,
});
