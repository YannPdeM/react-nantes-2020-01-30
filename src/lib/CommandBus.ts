import { CommandBusMiddleware, CommandResponse } from './DDD_ES';

export default class CommandBus {
	chain: CommandBusMiddleware;
	constructor(
		chainOfMiddlewaresThatEndsWithACommandDispatcher: CommandBusMiddleware
	) {
		this.chain = chainOfMiddlewaresThatEndsWithACommandDispatcher;
	}
	dispatch(command): CommandResponse {
		return this.chain.dispatch(command);
	}
}
