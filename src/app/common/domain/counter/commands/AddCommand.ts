import {
	Command as DDDCommand,
	id as DDDId,
} from '../../../../../lib/DDD_ES/DDD_ES';

export interface AddCommand extends DDDCommand {
	name: 'COUNTER_ADD';
	payload: {
		aggregateId: DDDId;
		howMuch: number;
	};
}
