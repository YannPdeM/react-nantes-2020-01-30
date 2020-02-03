import EventDispatcherBusMiddleware from './EventDispatcherBusMiddleware';
import {
	createDomainCommand,
	createDomainEvent,
	DomainCommand,
	DomainCommandResponse,
	DomainEvent,
	DomainId,
	DomainSuccessfulCommandResponse,
	LibCommandBusMiddleware,
	LibCommandHandler,
	LibEventHandler,
} from '../DDD_ES';
import { right } from 'fp-ts/lib/Either';
import commandBus from './commandBus';
import eventBus from '../eventBus/eventBus';
import { some } from 'fp-ts/lib/Option';

describe(' an EventDispatcherBusMiddleware', () => {
	const aSilentLogger = {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		log: jest.fn((message): void => undefined),
	};

	const anAggregateId: DomainId = 'SOME_AGGREGATE_ID';

	const aCommand = createDomainCommand({
		name: 'AN_INTENTION',
		payload: some({
			id: anAggregateId,
		}),
	});

	const anEvent = createDomainEvent({
		name: 'SOMETHING_HAPPENED',
		aggregateId: anAggregateId,
		version: 0,
		eventId: 'AN_EVENT_ID',
	});

	const aCommmandResponse: DomainSuccessfulCommandResponse = {
		aggregateId: anEvent.aggregateId,
		version: anEvent.version,
		events: [anEvent],
	};

	const aCommandHandler: LibCommandHandler = Object.assign(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async (command: DomainCommand): Promise<DomainCommandResponse> =>
			right(aCommmandResponse),
		{
			listenTo: () => aCommand.name,
		}
	);

	const anEventHandler: LibEventHandler = Object.assign(
		async (event: DomainEvent): Promise<void> => aSilentLogger.log(event),
		{
			listenTo: () => [anEvent.name],
		}
	);

	const anEventBus = eventBus(anEventHandler);

	const anEventDispatcherBusMiddleware: LibCommandBusMiddleware = EventDispatcherBusMiddleware(
		anEventBus
	)(aCommandHandler);

	const aCommandBus = commandBus(anEventDispatcherBusMiddleware);

	beforeEach(() => {
		aSilentLogger.log.mockClear();
	});

	it('catches the result of the `commandHandler` and send it one by one through the `EventBus`', async () => {
		const cr = await aCommandBus(aCommand);
		expect(aSilentLogger.log.mock.calls.length).toBe(1);
		expect(aSilentLogger.log.mock.calls[0][0]).toEqual(anEvent);
		expect(cr).toEqual(right(aCommmandResponse));
	});
});
