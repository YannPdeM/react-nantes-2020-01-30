import {
	DomainCommand,
	LibCommandBusMiddleware,
	DomainCommandResponse,
} from '../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

export default (
	next: LibCommandBusMiddleware
): LibCommandBusMiddleware => async (
	command: DomainCommand
): Promise<DomainCommandResponse> => await next(command);
