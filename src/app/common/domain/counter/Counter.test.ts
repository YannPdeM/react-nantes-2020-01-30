import Counter from './Counter';
import { CounterEvent, createCounterEvent } from './events/CounterEvents';
import { createEvent, Logger } from '../../../../lib/DDD_ES';

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
			name: 'ADDED',
			aggregateId: counter.id,
			version: counter.lastVersion + 1,
			payload: 5,
			timestamp: Date.now(),
		});

		const subtractEvent = createCounterEvent({
			name: 'SUBTRACTED',
			aggregateId: counter.id,
			version: counter.lastVersion + 2,
			payload: 1,
		});

		const multiplyEvent = createCounterEvent({
			name: 'MULTIPLIED',
			aggregateId: counter.id,
			version: counter.lastVersion + 3,
			payload: 2,
		});

		const divideEvent = createCounterEvent({
			name: 'DIVIDED',
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
		let lastLog: string = null;
		const logger: Logger = {
			log: (message) => (lastLog = message),
		};
		const id = 'error_test';
		const lastVersion = 2;

		const counter = new Counter({ id, lastVersion }, logger);
		const errorEvent = createEvent({
			name: 'ERROR',
			aggregateId: counter.id,
			version: counter.lastVersion + 1,
			timestamp: Date.now(),
			payload: 'Whatever',
		}) as CounterEvent;
		counter.applyEvents([errorEvent]);

		expect(lastLog).toBe(
			`${id}@${lastVersion + 1}: ignored error: ${errorEvent.payload}`
		);
	});
});
