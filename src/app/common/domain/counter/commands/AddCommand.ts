import { DomainCommand, DomainId } from '../../../../../lib/DDD_ES/DDD_ES';
import { CounterCommandNames } from './CounterCommandNames';

export interface AddCommand extends DomainCommand {
	name: CounterCommandNames.Add;
	payload: {
		aggregateId: DomainId;
		howMuch: number;
	};
}
