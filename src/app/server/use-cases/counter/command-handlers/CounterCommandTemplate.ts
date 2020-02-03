import {
	DomainCommandResponse,
	LibEventStore,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import { CounterCommand } from '../../../../common/domain/counter/commands/CounterCommands';
import CounterRepository from '../repository/CounterRepository';
import { either } from 'fp-ts';
import { toNullable } from 'fp-ts/lib/Option';

export default (store: LibEventStore) => (variant: Function) => async (
	counterCommand: CounterCommand
): Promise<DomainCommandResponse> => {
	const repo = new CounterRepository(store);
	const { aggregateId } = toNullable(counterCommand.payload);
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
