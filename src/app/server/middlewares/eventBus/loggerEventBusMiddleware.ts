import { Logger } from '../../../../DDD_ES_Lib/utils/Logger';
import {
	DomainEvent,
	LibEventBusMiddleware,
	LibEventBusMiddlewareFactory,
} from '../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

export default (logger: Logger): LibEventBusMiddlewareFactory => (
	next: LibEventBusMiddleware
): LibEventBusMiddleware => async (event: DomainEvent): Promise<void> => {
	logger.log({
		when: Date.now(),
		event,
	});
	return await next(event);
};
