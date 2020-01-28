import {
	LibCommandHandler,
	DomainCommandName,
	LibEventStore,
} from '../../../../../lib/DDD_ES/DDD_ES';

import {
	CounterCommandNames,
	DivideCommand,
} from '../../../../common/domain/counter/commands/CounterCommands';
import CounterCommandTemplate from './CounterCommandTemplate';
import Counter from '../../../../common/domain/counter/Counter';

export default (store: LibEventStore): LibCommandHandler =>
	Object.assign(
		CounterCommandTemplate(
			store
		)((counter: Counter, divideCommand: DivideCommand) =>
			counter.divide(divideCommand)
		),
		{
			listenTo(): DomainCommandName {
				return CounterCommandNames.Divide;
			},
		}
	);
