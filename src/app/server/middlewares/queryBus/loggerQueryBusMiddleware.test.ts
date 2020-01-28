import loggerQueryBusMiddleware from './loggerQueryBusMiddleware';
import {
	DomainQuery,
	LibQueryBusMiddleware,
} from '../../../../lib/DDD_ES/DDD_ES';

describe('a loggerQueryBusMiddleware', () => {
	it('logs the passed query', async () => {
		const aQuery: DomainQuery = {
			name: 'SOME_QUERY_NAME',
		};

		const aQbm = jest.fn(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			async (query: DomainQuery) => ({
				value: {
					something: 'anything',
				},
			})
		) as jest.MockedFunction<LibQueryBusMiddleware>;

		const aLogger = {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			log: jest.fn((message) => undefined),
		};

		const aLqbm = loggerQueryBusMiddleware(aLogger)(aQbm);

		await aLqbm(aQuery);

		expect(aQbm.mock.calls.length).toBe(1);
		expect(aQbm.mock.calls[0][0]).toBe(aQuery);

		expect(aLogger.log.mock.calls.length).toBe(1);
		expect(aLogger.log.mock.calls[0][0]).toMatchObject(
			expect.objectContaining({
				when: expect.any(Number),
				query: expect.objectContaining({
					name: expect.any(String),
				}),
			})
		);
	});
});
