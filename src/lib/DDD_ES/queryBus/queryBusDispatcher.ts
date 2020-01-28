import {
	DomainQuery,
	DomainQueryName,
	DomainViewModel,
	LibQueryBusMiddleware,
	LibQueryHandler,
} from '../DDD_ES';

export default (
	handlers: ReadonlyArray<LibQueryHandler>
): LibQueryBusMiddleware => {
	const handlersMap = new Map<DomainQueryName, LibQueryHandler>();
	handlers.forEach((handler) => {
		handlersMap.set(handler.listenTo(), handler);
	});

	return async (query: DomainQuery): Promise<DomainViewModel> => {
		const { name } = query;
		const handler = handlersMap.get(name);
		if (handler === undefined) {
			throw new Error(`No query handler found for ${name}`);
		}
		return await handler(query);
	};
};
