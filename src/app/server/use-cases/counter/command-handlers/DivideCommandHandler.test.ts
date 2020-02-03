import { CounterCommandNames } from '../../../../common/domain/counter/commands/CounterCommands';

import DivideCommandHandler from './DivideCommandHandler';
import InMemoryEventStore from '../../../../../DDD_ES_Lib/infrastructure/InMemory/EventStore/InMemoryEventStore';
import {
	createDomainCommand,
	DomainSuccessfulCommandResponse,
} from '../../../../../DDD_ES_Lib/DDD_ES/DDD_ES';
import { Right } from 'fp-ts/lib/Either';
import { CounterEventsNames } from '../../../../common/domain/counter/events/CounterEvents';
import { either } from 'fp-ts';
import { none, some } from 'fp-ts/lib/Option';

describe('An DivideCommandHandler', () => {
	const AN_AGGREGATE_ID = 'AN_AGGREGATE_ID';
	const SOME_NUMBER = 123;

	const dch = DivideCommandHandler(new InMemoryEventStore());
	const dc = createDomainCommand({
		name: CounterCommandNames.Divide,
		payload: some({
			aggregateId: AN_AGGREGATE_ID,
			howMuch: SOME_NUMBER,
		}),
	});

	it('listens to the DivideCommand', () => {
		expect(dch.listenTo()).toBe(dc.name);
	});

	it('spawns `DividedEvent`s', async () => {
		const {
			right: { aggregateId, version, events },
		} = (await dch(dc)) as Right<DomainSuccessfulCommandResponse>;

		expect(aggregateId).toBe(AN_AGGREGATE_ID);
		expect(version).toBe(0);
		expect(events.length).toBe(1);
		expect(events[0]).toMatchObject({
			eventId: expect.any(String),
			aggregateId: AN_AGGREGATE_ID,
			version: 0,
			name: CounterEventsNames.Divided,
			payload: some(SOME_NUMBER),
			timestamp: expect.any(Number),
			meta: none,
		});
	});

	it('we can’t divide by 0', async () => {
		const aFailingDivideCommand = createDomainCommand({
			name: CounterCommandNames.Divide,
			payload: some({
				aggregateId: AN_AGGREGATE_ID,
				howMuch: 0,
			}),
		});

		const result = await dch(aFailingDivideCommand);

		// we should use the result instead of the side effects but for tonight that will be enough
		either.fold(
			(e: Error) => {
				expect(e).toEqual(new Error('Cannot divide by 0'));
				return e;
			},
			(a) => {
				fail(
					'this should’t be a `DomainSuccessfulCommandResponse` but an `Error`'
				);
				return a;
			}
		)(result);
	});
});
