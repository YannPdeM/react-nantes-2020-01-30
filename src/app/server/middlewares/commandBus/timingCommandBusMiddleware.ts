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
	const startTime = Date.now();
	const response = await next(command);
	const endTime = Date.now();
	const elapsed = endTime - startTime;
	const message = `Command ${command.name} took ${elapsed} ms`;
	logger.log(message);
	return response;
};
