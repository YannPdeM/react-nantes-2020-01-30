import {
	createDomainEvent,
	DomainEvent,
	LibEventHandler,
	DomainId,
	DomainVersion,
} from '../DDD_ES';
import eventBus from './eventBus';
import timingEventBusMiddleware from '../../../app/server/middlewares/eventBus/timingEventBusMiddleware';
import loggerEventBusMiddleware from '../../../app/server/middlewares/eventBus/loggerEventBusMiddleware';
import eventBusDispatcher from './eventBusDispatcher';

const createSomeEvent = (
	aggregateId: DomainId,
	version: DomainVersion,
	quantity: number
): DomainEvent => ({
	eventId: 'SOME_EVENT_ID',
	name: 'AN_EVENT_NAME',
	aggregateId: aggregateId,
	version: version,
	timestamp: Date.now(),
	payload: {
		qty: quantity,
	},
});

describe(' an EventBus', () => {
	const anAggregateId = 'AN_AGGREGATE_ID';
	const anEvent = createSomeEvent(anAggregateId, 0, 1);

	const t = jest.fn(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async (event: DomainEvent): Promise<void> => undefined
	);

	const dummyEventHandler: LibEventHandler = Object.assign(t, {
		listenTo: () => ['AN_EVENT_NAME'],
	});

	const silentLogger = {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		log: jest.fn((message): void => undefined),
	};

	beforeEach(() => {
		silentLogger.log.mockClear();
	});

	it('goes through it’s middlewares', async () => {
		const chain = timingEventBusMiddleware(silentLogger)(
			loggerEventBusMiddleware(silentLogger)(
				eventBusDispatcher([dummyEventHandler])
			)
		);

		const anEventBus = eventBus(chain);

		await anEventBus(anEvent);
		expect(silentLogger.log.mock.calls.length).toBeGreaterThanOrEqual(1);
		expect(t.mock.calls.length).toBe(1);
		expect(t.mock.calls[0][0]).toBe(anEvent);
	});

	it('throws when we call an unknown event', async () => {
		const chain = timingEventBusMiddleware(silentLogger)(
			loggerEventBusMiddleware(silentLogger)(
				eventBusDispatcher([dummyEventHandler])
			)
		);

		const anEventBus = eventBus(chain);

		const failingEvent = createDomainEvent({
			name: 'FAILING_EVENT',
			aggregateId: anAggregateId,
			version: 1,
		});
		try {
			await anEventBus(failingEvent);
		} catch (e) {
			expect(e).toEqual(
				new Error(`No event handler found for ${failingEvent.name}`)
			);
		}
	});

	it('allows multiple handlers per event', async () => {
		const anotherDummyEventHandler: LibEventHandler = Object.assign(t, {
			listenTo: () => ['AN_EVENT_NAME'],
		});

		const chain = timingEventBusMiddleware(silentLogger)(
			loggerEventBusMiddleware(silentLogger)(
				eventBusDispatcher([dummyEventHandler, anotherDummyEventHandler])
			)
		);

		const anEventBus = eventBus(chain);

		await anEventBus(anEvent);
		expect(silentLogger.log.mock.calls.length).toBeGreaterThanOrEqual(2);
		expect(t.mock.calls.length).toBe(3);
		expect(t.mock.calls[0][0]).toBe(anEvent);
		expect(t.mock.calls[1][0]).toBe(anEvent);
	});
});
