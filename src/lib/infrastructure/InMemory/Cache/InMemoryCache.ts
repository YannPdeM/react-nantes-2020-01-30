import {
	LibCache,
	DomainVersion,
	DomainViewModel,
} from '../../../DDD_ES/DDD_ES';

export default (): LibCache => {
	const innerMap: Map<string, DomainViewModel> = new Map();

	return {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		get: async (id: string, version: DomainVersion): Promise<any> => {
			const inCache = innerMap.get(id);
			return version === undefined || version === inCache.version
				? inCache // to test
				: undefined;
		},
		set: async (id: string, vm: DomainViewModel): Promise<void> => {
			const valueToSave = {
				...(vm.version !== undefined && { version: vm.version }),
				value: vm.value === undefined ? null : vm.value, // to test
			};
			innerMap.set(id, valueToSave);
		},
		delete: async (id: string): Promise<void> => {
			innerMap.delete(id);
		},
	};
};
