import {
	Command,
	CommandHandler,
	commandName,
	CommandResponse,
	id,
} from '../../../../../lib/DDD_ES';

import CounterRepository from '../repository/CounterRepository';
import { AddCommand } from '../../../../common/domain/counter/commands/AddCommand';

export default class AddCommandHandler implements CommandHandler {
	repo: CounterRepository;

	constructor(store) {
		this.repo = new CounterRepository(store);
	}

	listenTo(): commandName {
		return 'COUNTER_ADD';
	}

	handle(addCommand: AddCommand): CommandResponse {
		const { aggregateId } = addCommand.payload;
		const counter = this.repo.getById(aggregateId);
		const events = counter.add(addCommand);
		counter.applyEvents(events);
		this.repo.saveEvents(events);
		return {
			aggregateId: counter.id,
			version: counter.lastVersion,
			events,
		};
	}
}
