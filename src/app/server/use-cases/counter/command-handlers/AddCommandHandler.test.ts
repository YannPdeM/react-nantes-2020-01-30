import { AddCommand } from '../../../../common/domain/counter/commands/AddCommand';

import AddCommandHandler from './AddCommandHandler';
import InMemoryEventStore from '../../../../../lib/infrastructure/InMemoryEventStore';
import { createCommand } from '../../../../../lib/DDD_ES/DDD_ES';

describe('An AddCommandHandler', () => {
	const AN_AGGREGATE_ID = 'AN_AGGREGATE_ID';
	const SOME_NUMBER = 123;

	const ach = new AddCommandHandler(new InMemoryEventStore());
	const ac = createCommand({
		name: 'COUNTER_ADD',
		payload: {
			aggregateId: AN_AGGREGATE_ID,
			howMuch: SOME_NUMBER,
		},
	}) as AddCommand;

	it('listens to the AddCommand', () => {
		expect(ach.listenTo()).toBe(ac.name);
	});

	it('…', () => {
		const beforeHandlingCommand = Date.now();
		const { aggregateId, version, events } = ach.handle(ac);
		const afterHandlingCommand = Date.now();

		expect(aggregateId).toBe(AN_AGGREGATE_ID);
		expect(version).toBe(0);
		expect(events.length).toBe(1);
		expect(events[0]).toMatchObject({
			eventId: expect.any(String),
			aggregateId: AN_AGGREGATE_ID,
			version: 0,
			name: 'ADDED',
			payload: SOME_NUMBER,
			timestamp: expect.any(Number),
			meta: undefined,
		});

		const { timestamp: ts } = events[0];
		expect(ts).toBeGreaterThanOrEqual(beforeHandlingCommand);
		expect(ts).toBeLessThanOrEqual(afterHandlingCommand);
	});
});
