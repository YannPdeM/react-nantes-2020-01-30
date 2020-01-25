import { AddCommand } from '../../../../common/domain/counter/commands/AddCommand';

import addCommandHandler from './addCommandHandler';
import InMemoryEventStore from '../../../../../lib/infrastructure/InMemoryEventStore';
import {
	createCommand,
	HappyCommandResponse,
} from '../../../../../lib/DDD_ES/DDD_ES';
import { Right } from 'fp-ts/lib/Either';

describe('An AddCommandHandler', () => {
	const AN_AGGREGATE_ID = 'AN_AGGREGATE_ID';
	const SOME_NUMBER = 123;

	const ach = addCommandHandler(new InMemoryEventStore());
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

	it('…', async () => {
		const beforeHandlingCommand = Date.now();
		const {
			right: { aggregateId, version, events },
		} = (await ach(ac)) as Right<HappyCommandResponse>;
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
