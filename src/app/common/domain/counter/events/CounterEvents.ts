import {
	DomainEvent,
	DomainId,
	DomainVersion,
	DomainTimestamp,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

import { v4 as uuid } from 'uuid';
import { none, some, Option, Some } from 'fp-ts/lib/Option';

export enum CounterEventsNames {
	Added = 'Counter:Event:Added',
	Subtracted = 'Counter:Event:Subtracted',
	Multiplied = 'Counter:Event:Multiplied',
	Divided = 'Counter:Event:Divided',
}

export interface CounterEvent extends DomainEvent {
	name: CounterEventsNames;
	payload: Some<number>;
}
export const createCounterEvent = ({
	eventId = uuid(),
	name,
	aggregateId,
	version,
	timestamp = Date.now(),
	payload,
	meta = none,
}: {
	eventId?: DomainId;
	name: CounterEventsNames;
	aggregateId: DomainId;
	version: DomainVersion;
	timestamp?: DomainTimestamp;
	payload: number;
	meta?: Option<unknown>;
}): CounterEvent => ({
	eventId,
	name,
	aggregateId,
	version,
	timestamp,
	payload: some(payload) as Some<number>,
	meta,
});
