import { CommandBusMiddleware, CommandResponse } from '../../lib/DDD_ES';

export default class DummyCommandBusMiddleware implements CommandBusMiddleware {
	next: CommandBusMiddleware;

	constructor(next: CommandBusMiddleware) {
		this.next = next;
	}

	dispatch(command): CommandResponse {
		return this.next.dispatch(command);
	}
}
