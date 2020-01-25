import {
	Command,
	CommandBusMiddleware,
	CommandResponse,
	createCommand,
} from '../../../../lib/DDD_ES/DDD_ES';

import timingCommandBusMiddleware from './timingCommandBusMiddleware';
import { right } from 'fp-ts/lib/Either';

describe('A TimingCommandBusMiddleware', () => {
	const aCommand: Command = createCommand({ name: 'SOME_COMMAND_NAME' });

	const aCommandBusMiddleware = jest.fn(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async (command: Command): Promise<CommandResponse> =>
			right({
				aggregateId: '',
				version: 0,
				events: [],
			})
	) as jest.MockedFunction<CommandBusMiddleware>;

	const aLogger = {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		log: jest.fn((message): void => undefined),
	};

	const aTimingCommandBusMiddleware = timingCommandBusMiddleware(aLogger)(
		aCommandBusMiddleware
	);

	beforeEach(() => {
		aCommandBusMiddleware.mockClear();
		aLogger.log.mockClear();
	});

	it('calls it’s passed CommandBusMiddleware', async () => {
		await aTimingCommandBusMiddleware(aCommand);
		expect(aCommandBusMiddleware.mock.calls.length).toBe(1);
	});

	it('logs the time taken for a Command to be executed', async () => {
		const COMMAND_NAME_RE = /(^Command )(.+)( took [0-9]+ ms$)/;
		const TIME_TAKEN_RE = /(^Command .+ took )([0-9]+)( ms$)/;

		await aTimingCommandBusMiddleware(aCommand);
		expect(aLogger.log.mock.calls.length).toBe(1);

		const lastLog = aLogger.log.mock.calls[0][0];
		const commandName = lastLog.replace(COMMAND_NAME_RE, '$2');
		const timeTaken = lastLog.replace(TIME_TAKEN_RE, '$2');
		expect(commandName).toBe(aCommand.name);
		expect(parseFloat(timeTaken)).toBeGreaterThanOrEqual(0);
	});
});
