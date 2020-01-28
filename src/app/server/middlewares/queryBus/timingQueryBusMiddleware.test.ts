import timingQueryBusMiddleware from './timingQueryBusMiddleware';
import {
	DomainQuery,
	LibQueryBusMiddleware,
} from '../../../../lib/DDD_ES/DDD_ES';

describe('a timingQueryBusMiddleware', () => {
	it('logs the time taken for an Query to be executed', async () => {
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

		const aTqbm = timingQueryBusMiddleware(aLogger)(aQbm);

		await aTqbm(aQuery);

		expect(aQbm.mock.calls.length).toBe(1);
		expect(aQbm.mock.calls[0][0]).toBe(aQuery);

		expect(aLogger.log.mock.calls.length).toBe(1);
		const lastLog = aLogger.log.mock.calls[0][0];

		const QUERY_NAME_RE = /(^Query )(.+)( took [0-9]+ ms$)/;
		const queryName = lastLog.replace(QUERY_NAME_RE, '$2');
		expect(queryName).toBe(aQuery.name);

		const TIME_TAKEN_RE = /(^Query.+)([0-9]+)( ms$)/;
		const timeTaken = parseInt(lastLog.replace(TIME_TAKEN_RE, '$2'), 10);
		expect(timeTaken).toBeGreaterThanOrEqual(0);
	});
});
