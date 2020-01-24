import {
	CommandBusMiddleware,
	CommandResponse,
	Logger,
} from '../../../lib/DDD_ES';

export default class LoggerCommandBusMiddleware
	implements CommandBusMiddleware {
	next: CommandBusMiddleware;
	logger: Logger;

	constructor(next: CommandBusMiddleware, logger: Logger = console) {
		this.next = next;
		this.logger = logger;
	}

	dispatch(command): CommandResponse {
		this.logger.log({
			when: Date.now(),
			command,
		});
		return this.next.dispatch(command);
	}
}
