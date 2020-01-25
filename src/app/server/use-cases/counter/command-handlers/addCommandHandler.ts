import {
	CommandHandler,
	commandName,
	CommandResponse,
	EventStore,
} from '../../../../../lib/DDD_ES/DDD_ES';

import CounterRepository from '../repository/CounterRepository';
import { AddCommand } from '../../../../common/domain/counter/commands/AddCommand';

import { right } from 'fp-ts/lib/Either';

export default (store: EventStore): CommandHandler =>
	Object.assign(
		async (addCommand: AddCommand): Promise<CommandResponse> => {
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
			listenTo(): commandName {
				return 'COUNTER_ADD';
			},
		}
	);