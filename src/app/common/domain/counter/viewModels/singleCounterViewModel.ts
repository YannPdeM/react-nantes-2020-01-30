import {
	DomainId,
	DomainVersion,
	DomainVersionedViewModel,
} from '../../../../../lib/DDD_ES/DDD_ES';

export interface SingleCounterViewModel extends DomainVersionedViewModel {
	version: DomainVersion;
	value: {
		id: DomainId;
		value: number;
	};
}
