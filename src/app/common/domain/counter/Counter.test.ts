import { createDomainEvent } from '../../../../lib/DDD_ES/DDD_ES';

import Counter from './Counter';
import {
	CounterEvent,
	CounterEventsNames,
	createCounterEvent,
} from './events/CounterEvents';

describe('a Counter', () => {
	it('can add', () => {
		const counter = new Counter({ value: 1 });
		counter.added(2);
		expect(counter.value).toBe(3);
	});

	it('can subtract', () => {
		const counter = new Counter({ value: 3 });
		counter.subtracted(2);
		expect(counter.value).toBe(1);
	});

	it('can multiply', () => {
		const counter = new Counter({ value: 2 });
		counter.multiplied(3);
		expect(counter.value).toBe(6);
	});

	it('can divide', () => {
		const counter = new Counter({ value: 3 });
		counter.divided(2);
		expect(counter.value).toBe(1.5);
	});

	it('can follow events', () => {
		const counter = new Counter({ id: 'test_events' });

		const addEvent = createCounterEvent({
			name: CounterEventsNames.Added,
			aggregateId: counter.id,
			version: counter.lastVersion + 1,
			payload: 5,
			timestamp: Date.now(),
		});

		const subtractEvent = createCounterEvent({
			name: CounterEventsNames.Subtracted,
			aggregateId: counter.id,
			version: counter.lastVersion + 2,
			payload: 1,
		});

		const multiplyEvent = createCounterEvent({
			name: CounterEventsNames.Multiplied,
			aggregateId: counter.id,
			version: counter.lastVersion + 3,
			payload: 2,
		});

		const divideEvent = createCounterEvent({
			name: CounterEventsNames.Divided,
			aggregateId: counter.id,
			version: counter.lastVersion + 4,
			payload: 4,
		});

		counter.applyEvents([
			addEvent,
			subtractEvent,
			multiplyEvent,
			divideEvent,
		]);

		expect(counter.value).toBe(2);
	});

	it('doesn’t crash on error events', () => {
		const aLogger = {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			log: jest.fn((message): void => undefined),
		};

		const id = 'error_test';
		const lastVersion = 2;

		const counter = new Counter({ id, lastVersion }, aLogger);
		const errorEvent = createDomainEvent({
			name: 'ERROR',
			aggregateId: counter.id,
			version: counter.lastVersion + 1,
			timestamp: Date.now(),
			payload: 'Whatever',
		}) as CounterEvent;
		counter.applyEvents([errorEvent]);

		expect(aLogger.log.mock.calls[0][0]).toBe(
			`${id}@${lastVersion + 1}: ignored event: ${errorEvent.payload}`
		);
	});
});
