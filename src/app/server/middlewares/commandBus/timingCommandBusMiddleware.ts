import {
	Command,
	CommandBusMiddleware,
	CommandResponse,
} from '../../../../lib/DDD_ES/DDD_ES';
import { Logger } from '../../../../lib/utils/Logger';

export default (logger: Logger) => (next: CommandBusMiddleware) => (
	command: Command
): CommandResponse => {
	const startTime = Date.now();
	const response = next(command);
	const endTime = Date.now();
	const elapsed = endTime - startTime;
	const message = `Command ${command.name} took ${elapsed} ms`;
	logger.log(message);
	return response;
};
