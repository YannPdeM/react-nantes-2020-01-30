import { DomainViewModel } from '../../../../../lib/DDD_ES/DDD_ES';

export interface NumberOfCountersAndMedianOfAllViewModel
	extends DomainViewModel {
	value: {
		numberOfCounters: number;
		medianOfAll: number;
	};
}
