import { DomainEvent, LibEventBusMiddleware } from '../DDD_ES';

export default (chain: LibEventBusMiddleware) => async (
	event: DomainEvent
): Promise<void> => await chain(event);
