import {
	CounterCommandNames,
	SubtractCommand,
} from '../../../../common/domain/counter/commands/CounterCommands';

import SubtractCommandHandler from './SubtractCommandHandler';
import InMemoryEventStore from '../../../../../DDD_ES_Lib/infrastructure/InMemory/EventStore/InMemoryEventStore';
import {
	createDomainCommand,
	DomainSuccessfulCommandResponse,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import { Right } from 'fp-ts/lib/Either';
import { CounterEventsNames } from '../../../../common/domain/counter/events/CounterEvents';
import { none, some } from 'fp-ts/lib/Option';

describe('An SubtractCommandHandler', () => {
	const AN_AGGREGATE_ID = 'AN_AGGREGATE_ID';
	const SOME_NUMBER = 123;

	const sch = SubtractCommandHandler(new InMemoryEventStore());
	const sc = createDomainCommand({
		name: CounterCommandNames.Subtract,
		payload: some({
			aggregateId: AN_AGGREGATE_ID,
			howMuch: SOME_NUMBER,
		}),
	}) as SubtractCommand;

	it('listens to the SubtractCommand', () => {
		expect(sch.listenTo()).toBe(sc.name);
	});

	it('spawns `SubtractedEvent`s', async () => {
		const {
			right: { aggregateId, version, events },
		} = (await sch(sc)) as Right<DomainSuccessfulCommandResponse>;

		expect(aggregateId).toBe(AN_AGGREGATE_ID);
		expect(version).toBe(0);
		expect(events.length).toBe(1);
		expect(events[0]).toMatchObject({
			eventId: expect.any(String),
			aggregateId: AN_AGGREGATE_ID,
			version: 0,
			name: CounterEventsNames.Subtracted,
			payload: some(SOME_NUMBER),
			timestamp: expect.any(Number),
			meta: none,
		});
	});
});
