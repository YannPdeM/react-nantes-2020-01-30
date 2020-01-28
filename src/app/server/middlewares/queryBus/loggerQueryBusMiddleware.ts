import { Logger } from '../../../../lib/utils/Logger';
import {
	DomainQuery,
	DomainViewModel,
	LibQueryBusMiddleware,
	LibQueryBusMiddlewareFactory,
} from '../../../../lib/DDD_ES/DDD_ES';

export default (logger: Logger): LibQueryBusMiddlewareFactory => (
	next: LibQueryBusMiddleware
): LibQueryBusMiddleware => async (
	query: DomainQuery
): Promise<DomainViewModel> => {
	logger.log({
		when: Date.now(),
		query,
	});
	return await next(query);
};
