import inMemoryCache from './InMemoryCache';
import { DomainVersionedViewModel } from '../../../DDD_ES/DDD_ES';
import { Some, some, none } from 'fp-ts/lib/Option';

describe('a simple cache', () => {
	it('returns `none` when there is nothing in front of the key', async () => {
		const cache = inMemoryCache();
		expect(await cache.get('A non-existant key')).toBe(none);
	});

	it('returns a possibly outdated value when no version is given', async () => {
		const cache = inMemoryCache();
		const key = 'a key';
		const aVV: DomainVersionedViewModel = {
			version: some(0) as Some<number>,
			value: some(123),
		};
		await cache.set(key, aVV);
		expect(await cache.get(key)).toEqual(some(aVV));
		await cache.delete(key);
		expect(await cache.get(key)).toBe(none);
	});

	it('returns a possibly outdated value when no version is given', async () => {
		const cache = inMemoryCache();
		const key = 'another key';
		const aVV: DomainVersionedViewModel = {
			version: some(3) as Some<number>,
			value: some(456),
		};
		await cache.set(key, aVV);
		expect(await cache.get(key, 4)).toBe(none);
		expect(await cache.get(key, 2)).toBe(none);
		expect(await cache.get(key, 3)).toEqual(some(aVV));
		expect(await cache.get(key, undefined)).toEqual(some(aVV));
	});

	it('stores `none` when no value is provided', async () => {
		const cache = inMemoryCache();
		const key = 'yet another key';
		const aBorkedVV = {
			version: some(0) as Some<number>,
			value: undefined,
		};
		await cache.set(key, aBorkedVV);
		expect(await cache.get(key)).toEqual(
			some({
				version: some(0),
				value: none,
			})
		);
	});
});
