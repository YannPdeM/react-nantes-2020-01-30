import {
	Command,
	CommandBusMiddleware,
	CommandResponse,
} from '../../../../lib/DDD_ES/DDD_ES';
import { Logger } from '../../../../lib/utils/Logger';

export default (logger: Logger) => (next: CommandBusMiddleware) => (
	command: Command
): CommandResponse => {
	logger.log({
		when: Date.now(),
		command,
	});
	return next(command);
};
