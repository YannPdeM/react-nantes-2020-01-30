import { CommandResponse, createCommand } from '../../../lib/DDD_ES';
import DummyCommandBusMiddleware from './DummyCommandBusMiddleware';

describe('A LoggerCommandBusMiddleware', () => {
	it('calls it’s passed CommandBusMiddleware', () => {
		let aCbmHasBeenCalled = false;

		const aCommand = createCommand({ name: 'SOME_COMMAND_NAME' });

		const aCbm = {
			dispatch: (): CommandResponse => {
				aCbmHasBeenCalled = true;

				return {
					aggregateId: '',
					version: 0,
					events: [],
				};
			},
		};

		const aDcbm = new DummyCommandBusMiddleware(aCbm);
		aDcbm.dispatch(aCommand);

		expect(aCbmHasBeenCalled).toBe(true);
	});
});
