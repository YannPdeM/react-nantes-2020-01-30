import { Logger } from '../../../../lib/utils/Logger';
import {
	DomainEvent,
	LibEventBusMiddleware,
	LibEventBusMiddlewareFactory,
} from '../../../../lib/DDD_ES/DDD_ES';

export default (logger: Logger): LibEventBusMiddlewareFactory => (
	next: LibEventBusMiddleware
): LibEventBusMiddleware => async (event: DomainEvent): Promise<void> => {
	const startTime = Date.now();
	const response = await next(event);
	const endTime = Date.now();
	const elapsed = endTime - startTime;
	const { name, aggregateId, version } = event;
	const message = `Event ${name} (${aggregateId}@${version}) took ${elapsed} ms`;
	logger.log(message);
	return response;
};
