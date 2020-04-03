import {
	DomainEntity,
	DomainId,
	DomainVersion,
} from '../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import { Logger } from '../../../../DDD_ES_Lib/utils/Logger';

import {
	CounterEvent,
	CounterEventsNames,
	createCounterEvent,
} from './events/CounterEvents';
import {
	AddCommand,
	DivideCommand,
	MultiplyCommand,
	SubtractCommand,
} from './commands/CounterCommands';

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
		for (const {
			name,
			payload: { value },
			version,
		} of events) {
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

	add({
		payload: {
			value: { howMuch },
		},
	}: AddCommand): ReadonlyArray<CounterEvent> {
		return [
			createCounterEvent({
				name: CounterEventsNames.Added,
				aggregateId: this.id,
				version: this.lastVersion + 1,
				payload: howMuch,
			}),
		];
	}

	subtract({
		payload: {
			value: { howMuch },
		},
	}: SubtractCommand): ReadonlyArray<CounterEvent> {
		return [
			createCounterEvent({
				name: CounterEventsNames.Subtracted,
				aggregateId: this.id,
				version: this.lastVersion + 1,
				payload: howMuch,
			}),
		];
	}

	multiply({
		payload: {
			value: { howMuch },
		},
	}: MultiplyCommand): ReadonlyArray<CounterEvent> {
		return [
			createCounterEvent({
				name: CounterEventsNames.Multiplied,
				aggregateId: this.id,
				version: this.lastVersion + 1,
				payload: howMuch,
			}),
		];
	}

	divide({
		payload: {
			value: { howMuch },
		},
	}: DivideCommand): ReadonlyArray<CounterEvent> {
		if (howMuch === 0) {
			throw new Error('Cannot divide by 0');
		}
		return [
			createCounterEvent({
				name: CounterEventsNames.Divided,
				aggregateId: this.id,
				version: this.lastVersion + 1,
				payload: howMuch,
			}),
		];
	}
}
