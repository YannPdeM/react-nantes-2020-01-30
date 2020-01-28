import {
	DomainEvent,
	DomainId,
	DomainVersion,
	DomainTimestamp,
} from '../../../../../lib/DDD_ES/DDD_ES';

import { v4 as uuid } from 'uuid';

export enum CounterEventsNames {
	Added = 'Counter:Event:Added',
	Subtracted = 'Counter:Event:Subtracted',
	Multiplied = 'Counter:Event:Multiplied',
	Divided = 'Counter:Event:Divided',
}

// We could use a functional type for errors here
export interface CounterEvent extends DomainEvent {
	name: CounterEventsNames;
	payload: number;
}

export const createCounterEvent = ({
	eventId = uuid(),
	name,
	aggregateId,
	version,
	timestamp = Date.now(),
	payload,
	meta,
}: {
	eventId?: DomainId;
	name: CounterEventsNames;
	aggregateId: DomainId;
	version: DomainVersion;
	timestamp?: DomainTimestamp;
	payload: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
