import {
	LibCommandHandler,
	DomainCommandName,
	LibEventStore,
} from '../../../../../lib/DDD_ES/DDD_ES';

import {
	CounterCommandNames,
	MultiplyCommand,
} from '../../../../common/domain/counter/commands/CounterCommands';
import CounterCommandTemplate from './CounterCommandTemplate';
import Counter from '../../../../common/domain/counter/Counter';

export default (store: LibEventStore): LibCommandHandler =>
	Object.assign(
		CounterCommandTemplate(
			store
		)((counter: Counter, multiplyCommand: MultiplyCommand) =>
			counter.multiply(multiplyCommand)
		),
		{
			listenTo(): DomainCommandName {
				return CounterCommandNames.Multiply;
			},
		}
	);
