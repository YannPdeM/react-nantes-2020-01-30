import {
	CounterCommandNames,
	DivideCommand,
} from '../../../../common/domain/counter/commands/CounterCommands';

import DivideCommandHandler from './DivideCommandHandler';
import InMemoryEventStore from '../../../../../lib/infrastructure/InMemory/EventStore/InMemoryEventStore';
import {
	createDomainCommand,
	DomainSuccessfulCommandResponse,
} from '../../../../../lib/DDD_ES/DDD_ES';
import { Right } from 'fp-ts/lib/Either';
import { CounterEventsNames } from '../../../../common/domain/counter/events/CounterEvents';
import { either } from 'fp-ts';

describe('An DivideCommandHandler', () => {
	const AN_AGGREGATE_ID = 'AN_AGGREGATE_ID';
	const SOME_NUMBER = 123;

	const dch = DivideCommandHandler(new InMemoryEventStore());
	const dc = createDomainCommand({
		name: CounterCommandNames.Divide,
		payload: {
			aggregateId: AN_AGGREGATE_ID,
			howMuch: SOME_NUMBER,
		},
	}) as DivideCommand;

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
			payload: SOME_NUMBER,
			timestamp: expect.any(Number),
			meta: undefined,
		});
	});

	it('we can’t divide by 0', async () => {
		const aFailingDivideCommand = createDomainCommand({
			name: CounterCommandNames.Divide,
			payload: {
				aggregateId: AN_AGGREGATE_ID,
				howMuch: 0,
			},
		}) as DivideCommand;

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
