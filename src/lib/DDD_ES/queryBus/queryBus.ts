import { DomainQuery, DomainViewModel, LibQueryBusMiddleware } from '../DDD_ES';

export default (chain: LibQueryBusMiddleware) => async (
	query: DomainQuery
): Promise<DomainViewModel> => await chain(query);
