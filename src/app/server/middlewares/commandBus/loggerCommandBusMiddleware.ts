import {
	Command,
	CommandBusMiddleware,
	CommandBusMiddlewareFactory,
	CommandResponse,
} from '../../../../lib/DDD_ES/DDD_ES';
import { Logger } from '../../../../lib/utils/Logger';

export default (logger: Logger): CommandBusMiddlewareFactory => (
	next: CommandBusMiddleware
): CommandBusMiddleware => async (
	command: Command
): Promise<CommandResponse> => {
	logger.log({
		when: Date.now(),
		command,
	});
	return await next(command);
};
