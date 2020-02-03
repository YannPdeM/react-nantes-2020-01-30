import loggerQueryBusMiddleware from './loggerQueryBusMiddleware';
import {
	DomainQuery,
	LibQueryBusMiddleware,
} from '../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import { some } from 'fp-ts/lib/Option';

describe('a loggerQueryBusMiddleware', () => {
	it('logs the passed query', async () => {
		const aQuery: DomainQuery = {
			name: 'SOME_QUERY_NAME',
		};

		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		const aQbm = <jest.MockedFunction<LibQueryBusMiddleware>>(
			(<unknown>jest.fn(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				async (query: DomainQuery) => ({
					value: some({
						something: 'anything',
					}),
				})
			))
		);

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
