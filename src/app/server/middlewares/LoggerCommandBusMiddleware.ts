import {
	CommandBusMiddleware,
	CommandResponse,
} from '../../../lib/DDD_ES/DDD_ES';
import { Logger } from '../../../lib/utils/Logger';

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
