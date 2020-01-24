import {
	Command,
	CommandResponse,
	createCommand,
} from '../../../../lib/DDD_ES/DDD_ES';

import dummyCommandBusMiddleware from './dummyCommandBusMiddleware';

import { right } from 'fp-ts/lib/Either';

describe('A LoggerCommandBusMiddleware', () => {
	it('calls it’s passed CommandBusMiddleware', () => {
		let aCbmHasBeenCalled = false;

		const aCommand = createCommand({ name: 'SOME_COMMAND_NAME' });

		const aCbm = (next) => (command) => {
			aCbmHasBeenCalled = true;

			return right({
				aggregateId: '',
				version: 0,
				events: [],
			});
		};

		const aDcbm = dummyCommandBusMiddleware(aCbm(null));
		aDcbm(aCommand);

		expect(aCbmHasBeenCalled).toBe(true);
	});
});
