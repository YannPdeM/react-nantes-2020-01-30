import {
	CommandBusMiddleware,
	CommandHandler,
	CommandResponse,
} from './DDD_ES';

export default class CommandBusDispatcher implements CommandBusMiddleware {
	handlers: {};

	constructor(handlers: ReadonlyArray<CommandHandler>) {
		this.handlers = {};
		handlers.forEach((handler) => {
			this.handlers[handler.listenTo()] = handler;
		});
	}

	dispatch(command): CommandResponse {
		const commandName = command.name;
		const handler = this.handlers[commandName];
		if (handler === undefined) {
			throw new Error(`Handler for command ${commandName} not found`);
		}
		return handler.handle(command);
	}
}
