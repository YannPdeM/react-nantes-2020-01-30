import {
	LibCommandHandler,
	DomainCommandName,
	LibEventStore,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

import {
	CounterCommandNames,
	AddCommand,
} from '../../../../common/domain/counter/commands/CounterCommands';
import CounterCommandTemplate from './CounterCommandTemplate';
import Counter from '../../../../common/domain/counter/Counter';

export default (store: LibEventStore): LibCommandHandler =>
	Object.assign(
		CounterCommandTemplate(
			store
		)((counter: Counter, addCommand: AddCommand) => counter.add(addCommand)),
		{
			listenTo(): DomainCommandName {
				return CounterCommandNames.Add;
			},
		}
	);
