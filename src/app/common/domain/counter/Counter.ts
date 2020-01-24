import { Entity, id, Logger, version } from '../../../../lib/DDD_ES';

import { CounterEvent, createCounterEvent } from './events/CounterEvents';
import { AddCommand } from './commands/AddCommand';

import { v4 as uuid } from 'uuid';

export default class Counter implements Entity {
	id: id;
	lastVersion: version;
	value: number;
	logger: Logger;

	static eventNameToMethod = {
		ADDED: 'added',
		SUBTRACTED: 'subtracted',
		MULTIPLIED: 'multiplied',
		DIVIDED: 'divided',
		ERROR: 'ignored',
	};

	constructor(
		{ id = uuid(), lastVersion = -1, value = 0 },
		logger: Logger = console
	) {
		this.id = id;
		this.lastVersion = lastVersion;
		this.value = value;
		this.logger = logger;
	}

	applyEvents(events: ReadonlyArray<CounterEvent>): void {
		for (const { name, payload: value, version } of events) {
			this.lastVersion = version;
			this[Counter.eventNameToMethod[name]](value);
		}
	}

	added(value): void {
		this.value += value;
	}

	subtracted(value): void {
		this.value -= value;
	}

	multiplied(value): void {
		this.value *= value;
	}

	divided(value): void {
		this.value /= value;
	}

	ignored(value): void {
		this.logger.log(
			`${this.id}@${this.lastVersion}: ignored error: ${value}`
		);
	}

	add({ payload: { howMuch } }: AddCommand): ReadonlyArray<CounterEvent> {
		return [
			createCounterEvent({
				name: 'ADDED',
				aggregateId: this.id,
				version: this.lastVersion + 1,
				payload: howMuch,
			}),
		];
	}
}
