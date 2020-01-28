import {
	CounterCommandNames,
	MultiplyCommand,
} from '../../../../common/domain/counter/commands/CounterCommands';

import MultiplyCommandHandler from './MultiplyCommandHandler';
import InMemoryEventStore from '../../../../../lib/infrastructure/InMemory/EventStore/InMemoryEventStore';
import {
	createDomainCommand,
	DomainSuccessfulCommandResponse,
} from '../../../../../lib/DDD_ES/DDD_ES';
import { Right } from 'fp-ts/lib/Either';
import { CounterEventsNames } from '../../../../common/domain/counter/events/CounterEvents';

describe('An MultiplyCommandHandler', () => {
	const AN_AGGREGATE_ID = 'AN_AGGREGATE_ID';
	const SOME_NUMBER = 123;

	const mch = MultiplyCommandHandler(new InMemoryEventStore());
	const mc = createDomainCommand({
		name: CounterCommandNames.Multiply,
		payload: {
			aggregateId: AN_AGGREGATE_ID,
			howMuch: SOME_NUMBER,
		},
	}) as MultiplyCommand;

	it('listens to the MultiplyCommand', () => {
		expect(mch.listenTo()).toBe(mc.name);
	});

	it('spawns `MultipliedEvent`s', async () => {
		const {
			right: { aggregateId, version, events },
		} = (await mch(mc)) as Right<DomainSuccessfulCommandResponse>;

		expect(aggregateId).toBe(AN_AGGREGATE_ID);
		expect(version).toBe(0);
		expect(events.length).toBe(1);
		expect(events[0]).toMatchObject({
			eventId: expect.any(String),
			aggregateId: AN_AGGREGATE_ID,
			version: 0,
			name: CounterEventsNames.Multiplied,
			payload: SOME_NUMBER,
			timestamp: expect.any(Number),
			meta: undefined,
		});
	});
});
