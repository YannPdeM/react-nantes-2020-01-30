import { DomainId, DomainQuery } from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';

export const SingleCounterQueryName = 'SingleCounter';
export interface SingleCounterQuery extends DomainQuery {
	name: 'SingleCounter';
	id: DomainId;
}
