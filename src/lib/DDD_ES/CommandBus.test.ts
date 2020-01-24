import {
	CommandHandler,
	Event,
	id,
	version as DDDVersion,
	Command as DDDCommand,
	createCommand,
} from './DDD_ES';

import TimingCommandBusMiddleware from '../../app/server/middlewares/TimingCommandBusMiddleware';
import LoggerCommandBusMiddleware from '../../app/server/middlewares/LoggerCommandBusMiddleware';
import DummyCommandBusMiddleware from '../../app/server/middlewares/DummyCommandBusMiddleware';
import CommandBusDispatcher from './CommandBusDispatcher';
import CommandBus from './CommandBus';

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
	const dummyCommandHandler: CommandHandler = {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		handle(command) {
			handleHasBeenCalled = true;
			return {
				aggregateId: aggregateId,
				version: event.version,
				events: [event],
			};
		},
		listenTo() {
			return 'ADD_ONE';
		},
	};

	const command: DDDCommand = createCommand({
		name: 'ADD_ONE',
	});

	const chain = new TimingCommandBusMiddleware(
		new LoggerCommandBusMiddleware(
			new DummyCommandBusMiddleware(
				new CommandBusDispatcher([dummyCommandHandler])
			)
		)
	);

	const cb = new CommandBus(chain);

	it('goes through it’s middlewares', () => {
		const result = cb.dispatch(command);
		expect(handleHasBeenCalled).toBe(true);
		expect(result).toEqual({
			aggregateId,
			version: event.version,
			events: [event],
		});
	});

	it('throws when we call an unknown command', () => {
		const failingCommand = createCommand({ name: 'FAILING_COMMAND ' });
		expect(() => cb.dispatch(failingCommand)).toThrow(
			`Handler for command ${failingCommand.name} not found`
		);
	});
});
