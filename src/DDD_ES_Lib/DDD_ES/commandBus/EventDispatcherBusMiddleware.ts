import {
	DomainCommand,
	DomainCommandResponse,
	DomainEvent,
	LibCommandBusMiddleware,
	LibCommandBusMiddlewareFactory,
} from '../DDD_ES';
import { LibCommandBusDispatcher } from './commandBusDispatcher';
import { either } from 'fp-ts/lib/Either';

export default (eventBus): LibCommandBusMiddlewareFactory => (
	next: LibCommandBusDispatcher
): LibCommandBusMiddleware => async (
	command: DomainCommand
): Promise<DomainCommandResponse> => {
	const result: DomainCommandResponse = await next(command);

	either.map(result, ({ events }) => {
		events.forEach(async (event: DomainEvent) => {
			await eventBus(event);
		});
	});

	return result;
};
