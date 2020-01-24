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

const addedEvent = (
	aggregateId: id,
	version: DDDVersion,
	quantity: number
): Event => ({
	eventId: 'SOME_EVENT_ID',
	name: 'ADDED',
	aggregateId: aggregateId,
	version: version,
	timestamp: Date.now(),
	payload: {
		qty: quantity,
	},
});

describe('a command bus', () => {
	const aggregateId = 'fake_aggregate_id';
	const event = addedEvent(aggregateId, 0, 1);
	let handleHasBeenCalled = false;
	const dummyCommandHandler: CommandHandler = Object.assign(
		(command: Command): CommandResponse => {
			handleHasBeenCalled = true;
			return right({
				aggregateId: aggregateId,
				version: event.version,
				events: [event],
			});
		},
		{
			listenTo() {
				return 'ADD_ONE';
			},
		}
	);

	const command: DDDCommand = createCommand({
		name: 'ADD_ONE',
	});

	const logger = {
		log: (message): void => undefined,
	};

	const chain = timingCommandBusMiddleware(logger)(
		loggerCommandBusMiddleware(logger)(
			dummyCommandBusMiddleware(commandBusDispatcher([dummyCommandHandler]))
		)
	);

	const cb = commandBus(chain);

	it('goes through it’s middlewares', () => {
		const result = cb(command);
		expect(handleHasBeenCalled).toBe(true);
		expect(result).toEqual(
			right({
				aggregateId,
				version: event.version,
				events: [event],
			})
		);
	});

	it('throws when we call an unknown command', () => {
		const failingCommand = createCommand({ name: 'FAILING_COMMAND ' });
		expect(() => cb(failingCommand)).toThrow(
			`Handler for command ${failingCommand.name} not found`
		);
	});
});
