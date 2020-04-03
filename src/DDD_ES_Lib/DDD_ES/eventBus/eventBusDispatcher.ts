import {
	DomainEvent,
	LibEventBusMiddleware,
	LibEventHandler,
	DomainEventName,
} from '../DDD_ES';

export default (
	handlers: ReadonlyArray<LibEventHandler>
): LibEventBusMiddleware => {
	const handlersMap = new Map<DomainEventName, Array<LibEventHandler>>();
	handlers.forEach((handler) => {
		const listenedEvents = handler.listenTo();
		listenedEvents.forEach((le: DomainEventName) => {
			if (handlersMap[le] === undefined) {
				// to test : when it is already defined (multiple listeners)
				handlersMap[le] = [];
			}
			handlersMap[le].push(handler);
		});
	});

	return (event: DomainEvent): Promise<void> => {
		const { name: eventName } = event;
		const handlers = handlersMap[eventName];
		if (handlers === undefined) {
			throw new Error(`No event handler found for ${eventName}`);
		}
		handlers.forEach((handler) => {
			handler(event);
		});
		return;
	};
};
