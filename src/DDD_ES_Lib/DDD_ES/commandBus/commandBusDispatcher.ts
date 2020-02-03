import {
	DomainCommand,
	LibCommandBusMiddleware,
	LibCommandHandler,
	DomainCommandResponse,
} from '../DDD_ES';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LibCommandBusDispatcher extends LibCommandBusMiddleware {}

export default (
	handlers: ReadonlyArray<LibCommandHandler>
): LibCommandBusMiddleware => {
	const handlersMap = {};
	handlers.forEach((handler) => {
		handlersMap[handler.listenTo()] = handler;
	});

	return (command: DomainCommand): Promise<DomainCommandResponse> => {
		const { name: commandName } = command;
		const handler = handlersMap[commandName];
		if (handler === undefined) {
			throw new Error(`Handler for command ${commandName} not found`);
		}
		return handler(command);
	};
};
