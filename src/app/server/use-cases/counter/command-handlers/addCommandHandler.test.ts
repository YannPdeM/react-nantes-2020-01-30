import { Right } from 'fp-ts/lib/Either';
import { none, some } from 'fp-ts/lib/Option';

import {
	createDomainCommand,
	DomainSuccessfulCommandResponse,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import InMemoryEventStore from '../../../../../DDD_ES_Lib/infrastructure/InMemory/EventStore/InMemoryEventStore';

import { CounterEventsNames } from '../../../../common/domain/counter/events/CounterEvents';
import {
	CounterCommandNames,
	AddCommand,
} from '../../../../common/domain/counter/commands/CounterCommands';

import addCommandHandler from './addCommandHandler';

describe('An AddCommandHandler', () => {
	const AN_AGGREGATE_ID = 'AN_AGGREGATE_ID';
	const SOME_NUMBER = 123;

	const ach = addCommandHandler(new InMemoryEventStore());
	const ac = createDomainCommand({
		name: CounterCommandNames.Add,
		payload: some({
			aggregateId: AN_AGGREGATE_ID,
			howMuch: SOME_NUMBER,
		}),
	}) as AddCommand;

	it('listens to the AddCommand', () => {
		expect(ach.listenTo()).toBe(ac.name);
	});

	it('spawns `AddedEvent`s', async () => {
		const beforeHandlingCommand = Date.now();
		const {
			right: { aggregateId, version, events },
		} = (await ach(ac)) as Right<DomainSuccessfulCommandResponse>;
		const afterHandlingCommand = Date.now();

		expect(aggregateId).toBe(AN_AGGREGATE_ID);
		expect(version).toBe(0);
		expect(events.length).toBe(1);
		expect(events[0]).toMatchObject({
			eventId: expect.any(String),
			aggregateId: AN_AGGREGATE_ID,
			version: 0,
			name: CounterEventsNames.Added,
			payload: some(SOME_NUMBER),
			timestamp: expect.any(Number),
			meta: none,
		});

		const { timestamp: ts } = events[0];
		expect(ts).toBeGreaterThanOrEqual(beforeHandlingCommand);
		expect(ts).toBeLessThanOrEqual(afterHandlingCommand);
	});
});
