import { Either } from 'fp-ts/lib/Either';
import { v4 as uuid } from 'uuid';

export type id = string;
export type eventName = string;
export type version = number;
export type timestamp = number;

export interface Event {
	readonly name: eventName;
	readonly eventId: id;
	readonly aggregateId: id;
	readonly version: version;
	readonly timestamp: timestamp; // in theory optional
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly payload?: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly meta?: any;
}
export const createEvent = ({
	name,
	eventId = uuid(),
	aggregateId,
	version,
	timestamp = Date.now(),
	payload,
	meta,
}: {
	name: eventName;
	eventId?: id;
	aggregateId: id;
	version: version;
	timestamp?: timestamp;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload?: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	meta?: any;
}): Event => ({
	eventId,
	name,
	aggregateId,
	version,
	timestamp,
	payload,
	meta,
});

export interface EventStore {
	getEvents: (aggregateId: id, version?: version) => ReadonlyArray<Event>;
	add: (
		aggregateId: id,
		expectedSaveVersion: version,
		events: ReadonlyArray<Event>
	) => void;
}

export type commandName = string;
export interface Command {
	readonly name: commandName;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly payload?: any;
	readonly meta?: {
		readonly timestamp: timestamp; // in theory optional
	};
}
export const createCommand = ({
	name,
	payload = undefined,
	meta,
}: {
	name: commandName;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload?: any;
	meta?: {
		timestamp: timestamp; // in theory optional
	};
}): Command => ({
	name,
	payload,
	meta:
		meta !== undefined
			? meta
			: {
					timestamp: Date.now(),
			  },
});

export interface HappyCommandResponse {
	readonly aggregateId: id;
	readonly version: version;
	readonly events: ReadonlyArray<Event>;
}
export type CommandResponse = Either<Error, HappyCommandResponse>;

export interface CommandBusMiddleware {
	(command: Command): CommandResponse;
}

/*
 * the purely functional version would be:
 *
 * type State = any;
 * interface CommandHandlerBis {
 * 	(state: State, command: Command): State
 * }
 *
 * But here it will have to find the state from a repository
 */
export interface CommandHandler {
	(command: Command): CommandResponse;
	listenTo: () => commandName;
}
export interface CommandHandlerFactory {
	(next: CommandHandler): CommandHandler;
}

export interface Entity {
	id: id;
	lastVersion: version;
	applyEvents: (events: ReadonlyArray<Event>) => void;
}

export interface Repository<Entity, Event> {
	getById: (aggregateId: id) => Entity;
	saveEvents: (
		events: ReadonlyArray<Event>
	) => {
		lastVersion: version;
		lastState: Entity;
	};
}
