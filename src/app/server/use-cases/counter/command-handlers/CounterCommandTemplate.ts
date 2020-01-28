import {
	DomainCommandResponse,
	LibEventStore,
} from '../../../../../lib/DDD_ES/DDD_ES';
import { CounterCommand } from '../../../../common/domain/counter/commands/CounterCommands';
import CounterRepository from '../repository/CounterRepository';
import { either } from 'fp-ts';

export default (store: LibEventStore) => (variant: Function) => async (
	counterCommand: CounterCommand
): Promise<DomainCommandResponse> => {
	const repo = new CounterRepository(store);
	const { aggregateId } = counterCommand.payload;
	const counter = await repo.getById(aggregateId);
	try {
		const events = variant(counter, counterCommand);
		counter.applyEvents(events);
		await repo.saveEvents(events);
		return either.right({
			aggregateId: counter.id,
			version: counter.lastVersion,
			events,
		});
	} catch (e) {
		return either.left(e);
	}
};
