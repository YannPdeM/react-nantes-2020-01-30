import { Command, CommandResponse, createCommand } from '../../../lib/DDD_ES';
import LoggerCommandBusMiddleware from './LoggerCommandBusMiddleware';

describe('A LoggerCommandBusMiddleware', () => {
	let aCbmHasBeenCalled = false;
	let aLoggerLogHasBeenCalled = false;
	let lastLog: {
		when: string;
		command: Command;
	} = null;

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
	const aLogger = {
		log: (message): void => {
			lastLog = message;
			aLoggerLogHasBeenCalled = true;
		},
	};
	const aLcbm = new LoggerCommandBusMiddleware(aCbm, aLogger);

	beforeEach(() => {
		aCbmHasBeenCalled = false;
		aLoggerLogHasBeenCalled = false;
	});

	it('calls it’s passed CommandBusMiddleware', () => {
		aLcbm.dispatch(aCommand);
		expect(aCbmHasBeenCalled).toBe(true);
	});

	it('logs the Command going through', () => {
		aLcbm.dispatch(aCommand);
		expect(aLoggerLogHasBeenCalled).toBe(true);
		expect(lastLog).toMatchObject(
			expect.objectContaining({
				when: expect.any(Number),
				command: expect.objectContaining({
					name: expect.any(String),
				}),
			})
		);
	});
});
