import queryBusDispatcher from './queryBusDispatcher';
import queryBus from './queryBus';
import { DomainQuery, DomainViewModel, LibQueryHandler } from '../DDD_ES';
import timingQueryBusMiddleware from '../../../app/server/middlewares/queryBus/timingQueryBusMiddleware';
import loggerQueryBusMiddleware from '../../../app/server/middlewares/queryBus/loggerQueryBusMiddleware';
import { none, some } from 'fp-ts/lib/Option';

describe('a QueryBus', () => {
	const aQuery: DomainQuery = {
		name: 'SOME_QUERY_NAME',
	};

	const t = jest.fn(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async (query: DomainQuery): Promise<DomainViewModel> => ({
			value: some({}),
			version: none,
		})
	);
	const dummyQueryHandler: LibQueryHandler = Object.assign(t, {
		listenTo: () => aQuery.name,
	});

	const silentLogger = {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		log: jest.fn((message): void => undefined),
	};

	const chain = timingQueryBusMiddleware(silentLogger)(
		loggerQueryBusMiddleware(silentLogger)(
			queryBusDispatcher([dummyQueryHandler])
		)
	);

	const aQueryBus = queryBus(chain);

	it('goes through it’s middlewares', async () => {
		await aQueryBus(aQuery);
		expect(silentLogger.log.mock.calls.length).toBeGreaterThanOrEqual(1);
		expect(t.mock.calls.length).toBe(1);
		expect(t.mock.calls[0][0]).toBe(aQuery);
	});

	it('throws when we call an unknown query', async () => {
		const failingQuery: DomainQuery = {
			name: 'FAILING_QUERY',
		};

		try {
			await aQueryBus(failingQuery);
		} catch (e) {
			expect(e).toEqual(
				new Error(`No query handler found for ${failingQuery.name}`)
			);
		}
	});
});
