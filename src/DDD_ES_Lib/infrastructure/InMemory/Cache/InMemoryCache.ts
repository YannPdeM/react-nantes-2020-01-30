import {
	LibCache,
	DomainVersion,
	DomainViewModel,
} from '../../../DDD_ES/DDD_ES';
import { none, Option, some, toNullable } from 'fp-ts/lib/Option';

export default (): LibCache => {
	const innerMap: Map<string, unknown> = new Map();

	return {
		get: async (
			id: string,
			version: DomainVersion
		): Promise<Option<unknown>> => {
			const inCache = innerMap.get(id) as DomainViewModel;
			if (inCache === undefined) {
				return none;
			} else {
				return version === undefined ||
					version === toNullable(inCache.version)
					? some(inCache)
					: none;
			}
		},
		set: async (id: string, vm: DomainViewModel): Promise<void> => {
			const valueToSave = {
				...(vm.version !== undefined && { version: vm.version }),
				value: vm.value === undefined ? none : vm.value,
			};
			innerMap.set(id, valueToSave);
		},
		delete: async (id: string): Promise<void> => {
			innerMap.delete(id);
		},
	};
};
