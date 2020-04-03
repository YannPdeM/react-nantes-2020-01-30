import { Either } from 'fp-ts/lib/Either';
import { v4 as uuid } from 'uuid';
import { none, Option, some, Some } from 'fp-ts/lib/Option';

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
	readonly payload: Option<unknown>;
	readonly meta: Option<unknown>;
}

export const createDomainEvent = ({
	name,
	eventId = uuid(),
	aggregateId,
	version,
	timestamp = Date.now(),
	payload = none,
	meta = none,
}: {
	name: DomainEventName;
	eventId?: DomainId;
	aggregateId: DomainId;
	version: DomainVersion;
	timestamp?: DomainTimestamp;
	payload?: Option<unknown>;
	meta?: Option<unknown>;
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
	value: Option<unknown>;
	version: Option<DomainVersion>;
}

export type DomainVersionedViewModel = DomainViewModel & {
	version: Some<DomainVersion>;
};

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

export type CommandMeta = {
	readonly timestamp: DomainTimestamp; // in theory optional
};

export interface DomainCommand {
	readonly name: DomainCommandName;
	readonly payload: Option<unknown>;
	readonly meta: Option<CommandMeta>;
}

export const createDomainCommand = ({
	name,
	payload = none,
	meta = none,
}: {
	name: DomainCommandName;
	payload?: Option<unknown>;
	meta?: Option<{
		timestamp: DomainTimestamp; // in theory optional
	}>;
}): DomainCommand => ({
	name,
	payload,
	meta:
		meta !== none
			? meta
			: some({
					timestamp: Date.now(),
			  }),
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
	get: (id: string, version?: DomainVersion) => Promise<Option<unknown>>;
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
