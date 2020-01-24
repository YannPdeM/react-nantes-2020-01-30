import {
	Command,
	CommandBusMiddleware,
	CommandHandler,
	CommandResponse,
} from './DDD_ES';

export default (
	handlers: ReadonlyArray<CommandHandler>
): CommandBusMiddleware => {
	const handlersMap = {};
	handlers.forEach((handler) => {
		handlersMap[handler.listenTo()] = handler;
	});

	return (command: Command): CommandResponse => {
		const { name: commandName } = command;
		const handler = handlersMap[commandName];
		if (handler === undefined) {
			throw new Error(`Handler for command ${commandName} not found`);
		}
		return handler(command);
	};
};
