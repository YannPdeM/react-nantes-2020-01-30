import { Command, id } from '../../../../../lib/DDD_ES';

export interface AddCommand extends Command {
	name: 'COUNTER_ADD';
	payload: {
		aggregateId: id;
		howMuch: number;
	};
}
