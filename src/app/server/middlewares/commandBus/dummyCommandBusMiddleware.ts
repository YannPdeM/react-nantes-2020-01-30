import {
	Command,
	CommandBusMiddleware,
	CommandResponse,
} from '../../../../lib/DDD_ES/DDD_ES';

export default (next: CommandBusMiddleware): CommandBusMiddleware => async (
	command: Command
): Promise<CommandResponse> => await next(command);
