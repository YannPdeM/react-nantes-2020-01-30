import {
	CommandHandler,
	Event,
	id,
	version,
	Command,
	createCommand,
} from './DDD_ES';

import TimingCommandBusMiddleware from '../app/middlewares/TimingCommandBusMiddleware';
import LoggerCommandBusMiddleware from '../app/middlewares/LoggerCommandBusMiddleware';
import DummyCommandBusMiddleware from '../app/middlewares/DummyCommandBusMiddleware';
import CommandBusDispatcher from './CommandBusDispatcher';
import CommandBus from './CommandBus';

const addedEvent = (
	aggregateId: id,
	version: version,
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

	const command: Command = createCommand({
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
