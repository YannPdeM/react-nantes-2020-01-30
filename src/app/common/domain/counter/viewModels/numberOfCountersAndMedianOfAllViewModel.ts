import { DomainViewModel } from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import { Option } from 'fp-ts/lib/Option';

export interface NumberOfCountersAndMedianOfAllViewModel
	extends DomainViewModel {
	value: Option<{
		// I want a Some but do not have a high-enough level of TypeScript yet
		numberOfCounters: number;
		medianOfAll: number;
	}>;
}
