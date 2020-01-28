import {
	DomainEntity,
	DomainId,
	DomainVersion,
} from '../../../../lib/DDD_ES/DDD_ES';
import { Logger } from '../../../../lib/utils/Logger';

import {
	CounterEvent,
	CounterEventsNames,
	createCounterEvent,
} from './events/CounterEvents';
import { AddCommand } from './commands/AddCommand';

import { v4 as uuid } from 'uuid';

export default class Counter implements DomainEntity {
	id: DomainId;
	lastVersion: DomainVersion;
	value: number;
	logger: Logger;

	static eventNameToMethod = (eventName: CounterEventsNames): string => {
		switch (eventName) {
			case CounterEventsNames.Added:
				return 'added';
			case CounterEventsNames.Subtracted:
				return 'subtracted';
			case CounterEventsNames.Multiplied:
				return 'multiplied';
			case CounterEventsNames.Divided:
				return 'divided';
			default:
				return 'ignored';
		}
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
			this[Counter.eventNameToMethod(name)](value);
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
			`${this.id}@${this.lastVersion}: ignored event: ${value}`
		);
	}

	add({ payload: { howMuch } }: AddCommand): ReadonlyArray<CounterEvent> {
		return [
			createCounterEvent({
				name: CounterEventsNames.Added,
				aggregateId: this.id,
				version: this.lastVersion + 1,
				payload: howMuch,
			}),
		];
	}
}
