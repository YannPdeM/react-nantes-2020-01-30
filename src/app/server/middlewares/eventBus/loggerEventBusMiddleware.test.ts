import loggerEventBusMiddleware from './loggerEventBusMiddleware';
import {
	createDomainEvent,
	LibEventBusMiddleware,
	DomainEvent,
} from '../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

describe('loggerEventBusMiddleware', () => {
	it('logs the passed event', async () => {
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
		const aLEBM = loggerEventBusMiddleware(aLogger)(anEBM);

		await aLEBM(anEvent);

		expect(anEBM.mock.calls.length).toBe(1);
		expect(anEBM.mock.calls[0][0]).toBe(anEvent);

		expect(aLogger.log.mock.calls.length).toBe(1);
		expect(aLogger.log.mock.calls[0][0]).toMatchObject(
			expect.objectContaining({
				when: expect.any(Number),
				event: expect.objectContaining({
					name: expect.any(String),
					aggregateId: expect.any(String),
					version: expect.any(Number),
				}),
			})
		);
	});
});
