import {
	CommandHandler,
	Event,
	id,
	version as DDDVersion,
	Command as DDDCommand,
	createCommand,
	Command,
	CommandResponse,
} from './DDD_ES';

import timingCommandBusMiddleware from '../../app/server/middlewares/commandBus/timingCommandBusMiddleware';
import loggerCommandBusMiddleware from '../../app/server/middlewares/commandBus/loggerCommandBusMiddleware';
import dummyCommandBusMiddleware from '../../app/server/middlewares/commandBus/dummyCommandBusMiddleware';
import commandBusDispatcher from './commandBusDispatcher';
import commandBus from './commandBus';
import { right } from 'fp-ts/lib/Either';

const createSomeEvent = (
	aggregateId: id,
	version: DDDVersion,
	quantity: number
): Event => ({
	eventId: 'SOME_EVENT_ID',
	name: 'A_COMMAND_NAME',
	aggregateId: aggregateId,
	version: version,
	timestamp: Date.now(),
	payload: {
		qty: quantity,
	},
});

describe('a command bus', () => {
	const aggregateId = 'fake_aggregate_id';
	const event = createSomeEvent(aggregateId, 0, 1);

	const t = jest.fn(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async (command: Command): Promise<CommandResponse> =>
			right({
				aggregateId: aggregateId,
				version: event.version,
				events: [event],
			})
	);

	const dummyCommandHandler: CommandHandler = Object.assign(t, {
		listenTo() {
			return 'A_COMMAND_NAME';
		},
	});

	const command: DDDCommand = createCommand({
		name: 'A_COMMAND_NAME',
	});

	const silentLogger = {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		log: (message): void => undefined,
	};

	const chain = timingCommandBusMiddleware(silentLogger)(
		loggerCommandBusMiddleware(silentLogger)(
			dummyCommandBusMiddleware(commandBusDispatcher([dummyCommandHandler]))
		)
	);

	const cb = commandBus(chain);

	it('goes through it’s middlewares', async () => {
		const result = await cb(command);
		expect(t.mock.calls.length).toBe(1);
		expect(result).toEqual(
			right({
				aggregateId,
				version: event.version,
				events: [event],
			})
		);
	});

	it('throws when we call an unknown command', async () => {
		const failingCommand = createCommand({ name: 'FAILING_COMMAND ' });
		try {
			await cb(failingCommand);
		} catch (e) {
			expect(e).toEqual(
				new Error(`Handler for command ${failingCommand.name} not found`)
			);
		}
	});
});
