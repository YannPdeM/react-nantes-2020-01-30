import timingEventBusMiddleware from './timingEventBusMiddleware';
import {
	createDomainEvent,
	LibEventBusMiddleware,
	DomainEvent,
} from '../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

describe('timingEventBusMiddleware', () => {
	it('logs the time taken for an Event to be executed', async () => {
		const aggregateId = 'AN_AGGREGATE_ID';

		const anEvent = createDomainEvent({
			name: 'SOMETHING_HAPPENED',
			aggregateId,
			version: 0,
		});

		const anEBM = jest.fn(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			(event: DomainEvent) => undefined
		) as jest.MockedFunction<LibEventBusMiddleware>;

		const aLogger = {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			log: jest.fn((message) => undefined),
		};
		const aTEBM = timingEventBusMiddleware(aLogger)(anEBM);

		await aTEBM(anEvent);

		expect(anEBM.mock.calls.length).toBe(1);
		expect(anEBM.mock.calls[0][0]).toBe(anEvent);

		expect(aLogger.log.mock.calls.length).toBe(1);
		const lastLog = aLogger.log.mock.calls[0][0];

		const EVENT_NAME_RE = /(^Event )(.+)( \(.+$)/;
		const eventName = lastLog.replace(EVENT_NAME_RE, '$2');
		expect(eventName).toBe(anEvent.name);

		const AGGREGATE_ID_RE = /(^Event .+ \()([^@]+)(@.+$)/;
		const id = lastLog.replace(AGGREGATE_ID_RE, '$2');
		expect(id).toBe(aggregateId);

		const VERSION_RE = /(^Event .+ \(.+@)([0-9]+)(\) took .+$)/;
		const version = lastLog.replace(VERSION_RE, '$2');
		expect(parseInt(version)).toBe(anEvent.version);

		const TIME_TAKEN_RE = /(^Event.+)([0-9]+)( ms$)/;
		const timeTaken = lastLog.replace(TIME_TAKEN_RE, '$2');
		expect(parseFloat(timeTaken)).toBeGreaterThanOrEqual(0);
	});
});
