import {
	DomainCommand,
	LibCommandBusMiddleware,
	DomainCommandResponse,
} from '../../../../lib/DDD_ES/DDD_ES';

export default (
	next: LibCommandBusMiddleware
): LibCommandBusMiddleware => async (
	command: DomainCommand
): Promise<DomainCommandResponse> => await next(command);
