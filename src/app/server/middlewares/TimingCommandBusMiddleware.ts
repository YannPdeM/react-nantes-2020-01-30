import {
	CommandBusMiddleware,
	CommandResponse,
} from '../../../lib/DDD_ES/DDD_ES';
import { Logger } from '../../../lib/utils/Logger';

export default class TimingCommandBusMiddleware
	implements CommandBusMiddleware {
	next: CommandBusMiddleware;
	logger: Logger;

	constructor(next: CommandBusMiddleware, logger: Logger = console) {
		this.next = next;
		this.logger = logger;
	}

	dispatch(command): CommandResponse {
		const startTime = Date.now();
		const response = this.next.dispatch(command);
		const endTime = Date.now();
		const elapsed = endTime - startTime;
		const message = `Command ${command.name} took ${elapsed} ms`;
		this.logger.log(message);
		return response;
	}
}
