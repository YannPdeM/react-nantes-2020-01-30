import {
	LibCommandHandler,
	DomainCommandName,
	LibEventStore,
} from '../../../../../lib/DDD_ES/DDD_ES';

import {
	CounterCommandNames,
	SubtractCommand,
} from '../../../../common/domain/counter/commands/CounterCommands';
import CounterCommandTemplate from './CounterCommandTemplate';
import Counter from '../../../../common/domain/counter/Counter';

export default (store: LibEventStore): LibCommandHandler =>
	Object.assign(
		CounterCommandTemplate(
			store
		)((counter: Counter, subtractCommand: SubtractCommand) =>
			counter.subtract(subtractCommand)
		),
		{
			listenTo(): DomainCommandName {
				return CounterCommandNames.Subtract;
			},
		}
	);
