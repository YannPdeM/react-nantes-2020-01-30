import {
	DomainCommand,
	LibCommandBusMiddleware,
	DomainCommandResponse,
} from '../DDD_ES';

/*
This chain must end with:
- a CommandBusMiddleware that will link the return to the EventBus just before
- the commandDispatcher at the very end
*/
export default (chain: LibCommandBusMiddleware) => async (
	command: DomainCommand
): Promise<DomainCommandResponse> => await chain(command);
