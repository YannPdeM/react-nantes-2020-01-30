import {
	Command,
	CommandBusMiddleware,
	CommandResponse,
} from '../../../../lib/DDD_ES/DDD_ES';

export default (next: CommandBusMiddleware) => (
	command: Command
): CommandResponse => next(command);
