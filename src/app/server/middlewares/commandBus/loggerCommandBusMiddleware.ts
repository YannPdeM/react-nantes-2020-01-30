import {
	DomainCommand,
	LibCommandBusMiddleware,
	LibCommandBusMiddlewareFactory,
	DomainCommandResponse,
} from '../../../../lib/DDD_ES/DDD_ES';
import { Logger } from '../../../../lib/utils/Logger';

export default (logger: Logger): LibCommandBusMiddlewareFactory => (
	next: LibCommandBusMiddleware
): LibCommandBusMiddleware => async (
	command: DomainCommand
): Promise<DomainCommandResponse> => {
	logger.log({
		when: Date.now(),
		command,
	});
	return await next(command);
};
