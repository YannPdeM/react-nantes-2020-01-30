import { Logger } from '../../../../DDD_ES_Lib/utils/Logger';
import {
	DomainQuery,
	DomainViewModel,
	LibQueryBusMiddleware,
	LibQueryBusMiddlewareFactory,
} from '../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

export default (logger: Logger): LibQueryBusMiddlewareFactory => (
	next: LibQueryBusMiddleware
): LibQueryBusMiddleware => async (
	query: DomainQuery
): Promise<DomainViewModel> => {
	const startTime = Date.now();
	const response = await next(query);
	const endTime = Date.now();
	const elapsed = endTime - startTime;
	const { name } = query;
	const message = `Query ${name} took ${elapsed} ms`;
	logger.log(message);
	return response;
};
