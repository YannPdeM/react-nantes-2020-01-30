import {
	LibCommandHandler,
	DomainCommandName,
	DomainCommandResponse,
	LibEventStore,
} from '../../../../../lib/DDD_ES/DDD_ES';

import CounterRepository from '../repository/CounterRepository';
import { AddCommand } from '../../../../common/domain/counter/commands/AddCommand';

import { right } from 'fp-ts/lib/Either';
import { CounterCommandNames } from '../../../../common/domain/counter/commands/CounterCommandNames';

export default (store: LibEventStore): LibCommandHandler =>
	Object.assign(
		async (addCommand: AddCommand): Promise<DomainCommandResponse> => {
			const repo = new CounterRepository(store);
			const { aggregateId } = addCommand.payload;
			const counter = await repo.getById(aggregateId);
			const events = counter.add(addCommand);
			counter.applyEvents(events);
			await repo.saveEvents(events);
			return right({
				aggregateId: counter.id,
				version: counter.lastVersion,
				events,
			});
		},
		{
			listenTo(): DomainCommandName {
				return CounterCommandNames.Add;
			},
		}
	);
