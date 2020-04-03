import {
	DomainCommand,
	LibCommandBusMiddleware,
	DomainCommandResponse,
	createDomainCommand,
} from '../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

import dummyCommandBusMiddleware from './dummyCommandBusMiddleware';

import { right } from 'fp-ts/lib/Either';

describe('A LoggerCommandBusMiddleware', () => {
	it('calls it’s passed CommandBusMiddleware', async () => {
		const aCommand: DomainCommand = createDomainCommand({
			name: 'SOME_COMMAND_NAME',
		});

		const aCommandBusMiddleware = jest.fn(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			async (command: DomainCommand): Promise<DomainCommandResponse> =>
				right({
					aggregateId: '',
					version: 0,
					events: [],
				})
		) as jest.MockedFunction<LibCommandBusMiddleware>;

		const aDummyCommandBusMiddleware = dummyCommandBusMiddleware(
			aCommandBusMiddleware
		);
		await aDummyCommandBusMiddleware(aCommand);

		expect(aCommandBusMiddleware.mock.calls.length).toBe(1);
		expect(aCommandBusMiddleware.mock.calls[0][0]).toBe(aCommand);
	});
});
