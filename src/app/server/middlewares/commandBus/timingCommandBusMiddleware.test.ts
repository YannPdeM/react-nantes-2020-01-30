import { CommandResponse, createCommand } from '../../../../lib/DDD_ES/DDD_ES';

import timingCommandBusMiddleware from './timingCommandBusMiddleware';
import { right } from 'fp-ts/lib/Either';

describe('A TimingCommandBusMiddleware', () => {
	let aCbmHasBeenCalled = false;
	let aLoggerLogHasBeenCalled = false;
	let lastLog: string = null;

	const aCommand = createCommand({ name: 'SOME_COMMAND_NAME' });
	const aCbm = (next) => (command) => {
		aCbmHasBeenCalled = true;

		return right({
			aggregateId: '',
			version: 0,
			events: [],
		});
	};
	const aLogger = {
		log: (message): void => {
			lastLog = message;
			aLoggerLogHasBeenCalled = true;
		},
	};
	const aTcbm = timingCommandBusMiddleware(aLogger)(aCbm(null));

	beforeEach(() => {
		aCbmHasBeenCalled = false;
		aLoggerLogHasBeenCalled = false;
	});

	it('calls it’s passed CommandBusMiddleware', () => {
		aTcbm(aCommand);
		expect(aCbmHasBeenCalled).toBe(true);
	});

	it('logs the time taken for a Command to be executed', () => {
		aTcbm(aCommand);
		expect(aLoggerLogHasBeenCalled).toBe(true);
		const commandName = lastLog.replace(
			/(^Command )(.+)( took [0-9]+ ms$)/,
			'$2'
		);
		const timeTaken = lastLog.replace(
			/(^Command .+ took )([0-9]+)( ms$)/,
			'$2'
		);
		expect(commandName).toBe(aCommand.name);
		expect(parseFloat(timeTaken)).toBeGreaterThanOrEqual(0);
	});
});
