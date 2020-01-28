import { Either } from 'fp-ts/lib/Either';
import { v4 as uuid } from 'uuid';

export type DomainId = string;
export type DomainEventName = string;
export type DomainVersion = number;
export type DomainTimestamp = number;

export interface DomainEvent {
	readonly name: DomainEventName;
	readonly eventId: DomainId;
	readonly aggregateId: DomainId;
	readonly version: DomainVersion;
	readonly timestamp: DomainTimestamp; // in theory optional
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly payload?: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly meta?: any;
}

export const createDomainEvent = ({
	name,
	eventId = uuid(),
	aggregateId,
	version,
	timestamp = Date.now(),
	payload,
	meta,
}: {
	name: DomainEventName;
	eventId?: DomainId;
	aggregateId: DomainId;
	version: DomainVersion;
	timestamp?: DomainTimestamp;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload?: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	meta?: any;
}): DomainEvent => ({
	eventId,
	name,
	aggregateId,
	version,
	timestamp,
	payload,
	meta,
});

export interface DomainEntity {
	id: DomainId;
	lastVersion: DomainVersion;
	applyEvents: (events: ReadonlyArray<DomainEvent>) => void;
}

export interface DomainViewModel {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;
	version?: DomainVersion;
}

export interface DomainVersionedViewModel extends DomainViewModel {
	version: DomainVersion;
}

export interface DomainRepository<Entity, Event> {
	getById: (aggregateId: DomainId) => Promise<Entity>;
	saveEvents: (
		events: ReadonlyArray<Event>
	) => Promise<{
		lastVersion: DomainVersion;
		lastState: Entity;
	}>;
}

export type DomainCommandName = string;

export interface DomainCommand {
	readonly name: DomainCommandName;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly payload?: any;
	readonly meta?: {
		readonly timestamp: DomainTimestamp; // in theory optional
	};
}

export const createDomainCommand = ({
	name,
	payload = undefined,
	meta,
}: {
	name: DomainCommandName;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload?: any;
	meta?: {
		timestamp: DomainTimestamp; // in theory optional
	};
}): DomainCommand => ({
	name,
	payload,
	meta:
		meta !== undefined
			? meta
			: {
					timestamp: Date.now(),
			  },
});

export interface DomainSuccessfulCommandResponse {
	readonly aggregateId: DomainId;
	readonly version: DomainVersion;
	readonly events: ReadonlyArray<DomainEvent>;
}

export type DomainCommandResponse = Either<
	Error,
	DomainSuccessfulCommandResponse
>;

/* ************************************************************************** */
export interface LibEventStore {
	getEvents: (
		aggregateId: DomainId,
		version?: DomainVersion
	) => Promise<ReadonlyArray<DomainEvent>>;
	add: (
		aggregateId: DomainId,
		expectedSaveVersion: DomainVersion,
		events: ReadonlyArray<DomainEvent>
	) => Promise<void>;
	getLastVersionOf: (aggregateId: DomainId) => Promise<DomainVersion>;
	getAllEvents: () => Promise<ReadonlyArray<DomainEvent>>;
	restore: () => Promise<void>;
}

/* ************************************************************************** */
export interface LibCommandBusMiddleware {
	(command: DomainCommand): Promise<DomainCommandResponse>;
}

export interface LibCommandBusMiddlewareFactory {
	(next: LibCommandBusMiddleware): LibCommandBusMiddleware;
}

/*
 * a purely functional version would be:
 *
 * type State = any;
 * interface CommandHandlerBis {
 * 	(state: State, command: DomainCommand): State
 * }
 *
 * But here it will have to find the state from a repository
 */
export interface LibCommandHandler {
	(command: DomainCommand): Promise<DomainCommandResponse>;

	listenTo: () => DomainCommandName;
}

/* ************************************************************************** */
export interface LibEventHandler {
	(event: DomainEvent): Promise<void>;
	listenTo: () => ReadonlyArray<DomainEventName>;
}

export interface LibEventBusMiddleware {
	(event: DomainEvent): Promise<void>;
}

export interface LibEventBusMiddlewareFactory {
	(next: LibEventBusMiddleware): LibEventBusMiddleware;
}

/* ************************************************************************** */
export interface LibCache {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get: (id: string, version?: DomainVersion) => Promise<any>;
	set: (id: string, value: DomainViewModel) => Promise<void>;
	delete: (id: string) => Promise<void>;
}

/* ************************************************************************** */

export type DomainQueryName = string;

export interface DomainQuery {
	name: DomainQueryName;
}

export interface LibQueryHandler {
	(query: DomainQuery): Promise<DomainViewModel>;
	listenTo: () => DomainQueryName;
}

export interface LibQueryBusMiddleware {
	(query: DomainQuery): Promise<DomainViewModel>;
}

export interface LibQueryBusMiddlewareFactory {
	(next: LibQueryBusMiddleware): LibQueryBusMiddleware;
}
