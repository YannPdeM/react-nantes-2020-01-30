import inMemoryCache from './InMemoryCache';
import { DomainVersionedViewModel } from '../../../DDD_ES/DDD_ES';

describe('a simple cache', () => {
	it('returns `undefined` when there is nothing in front of the key', async () => {
		const cache = inMemoryCache();
		expect(await cache.get('A non-existant key')).toBeUndefined();
	});

	it('returns a possibly outdated value when no version is given', async () => {
		const cache = inMemoryCache();
		const key = 'a key';
		const aVV: DomainVersionedViewModel = {
			version: 0,
			value: 123,
		};
		await cache.set(key, aVV);
		expect(await cache.get(key)).toEqual(aVV);
		await cache.delete(key);
		expect(await cache.get(key)).toBeUndefined();
	});

	it('returns a possibly outdated value when no version is given', async () => {
		const cache = inMemoryCache();
		const key = 'another key';
		const aVV: DomainVersionedViewModel = {
			version: 3,
			value: 456,
		};
		await cache.set(key, aVV);
		expect(await cache.get(key, 4)).toBeUndefined();
		expect(await cache.get(key, 2)).toBeUndefined();
		expect(await cache.get(key, 3)).toEqual(aVV);
		expect(await cache.get(key, undefined)).toEqual(aVV);
	});

	it('stores `null` when no value is provided', async () => {
		const cache = inMemoryCache();
		const key = 'yet another key';
		const aBorkedVV = {
			version: 0,
			value: undefined,
		};
		await cache.set(key, aBorkedVV);
		expect((await cache.get(key)).value).toBeNull();
	});
});
