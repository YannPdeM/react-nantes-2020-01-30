import { Logger } from '../../../../lib/utils/Logger';
import {
	DomainEvent,
	LibEventBusMiddleware,
	LibEventBusMiddlewareFactory,
} from '../../../../lib/DDD_ES/DDD_ES';

export default (logger: Logger): LibEventBusMiddlewareFactory => (
	next: LibEventBusMiddleware
): LibEventBusMiddleware => async (event: DomainEvent): Promise<void> => {
	logger.log({
		when: Date.now(),
		event,
	});
	return await next(event);
};
