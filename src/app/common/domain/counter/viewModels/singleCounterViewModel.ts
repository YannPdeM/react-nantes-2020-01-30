import {
	DomainId,
	DomainVersion,
	DomainVersionedViewModel,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import { Some } from 'fp-ts/lib/Option';

export interface SingleCounterViewModel extends DomainVersionedViewModel {
	version: Some<DomainVersion>;
	value: Some<{
		id: DomainId;
		value: Some<number>;
	}>;
}
