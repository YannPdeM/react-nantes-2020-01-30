import {
	DomainCommand,
	LibCommandBusMiddleware,
	DomainCommandResponse,
	createDomainCommand,
} from '../../../../lib/DDD_ES/DDD_ES';

import LoggerCommandBusMiddleware from './loggerCommandBusMiddleware';
import { right } from 'fp-ts/lib/Either';

describe('A LoggerCommandBusMiddleware', () => {
	const aCommand: DomainCommand = createDomainCommand({
		name: 'SOME_COMMAND_NAME',
	});

	const aCommandBusMiddleware = jest.fn(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async (command: DomainCommand): Promise<DomainCommandResponse> =>
			right({
				aggregateId: '',
				version: 0,
				events: [],
			})
	) as jest.MockedFunction<LibCommandBusMiddleware>;

	const aLogger = {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		log: jest.fn((message): void => undefined),
	};

	const aLoggerCommandBusMiddleware = LoggerCommandBusMiddleware(aLogger)(
		aCommandBusMiddleware
	);

	beforeEach(() => {
		aCommandBusMiddleware.mockClear();
		aLogger.log.mockClear();
	});

	it('calls it’s passed CommandBusMiddleware', async () => {
		await aLoggerCommandBusMiddleware(aCommand);
		expect(aCommandBusMiddleware.mock.calls.length).toBe(1);
	});

	it('logs the DomainCommand going through', async () => {
		await aLoggerCommandBusMiddleware(aCommand);
		expect(aLogger.log.mock.calls.length).toBe(1);
		expect(aLogger.log.mock.calls[0][0]).toMatchObject(
			expect.objectContaining({
				when: expect.any(Number),
				command: expect.objectContaining({
					name: expect.any(String),
				}),
			})
		);
	});
});
