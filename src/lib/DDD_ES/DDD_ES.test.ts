import {
	DomainEvent,
	createDomainEvent,
	DomainCommand,
	createDomainCommand,
} from './DDD_ES';
import { v4 as uuid } from 'uuid';

describe(' createDomainEvent', () => {
	const eventData: DomainEvent = {
		name: 'AN_EVENT_HAPPENED',
		eventId: uuid(),
		aggregateId: 'AN_AGGREGATE_ID',
		version: 0,
		timestamp: Date.now(),
		payload: {
			whatever: 'anything',
		},
		meta: {
			whateverAgain: 'anything again',
		},
	};

	it('generates a new Event when called properly', () => {
		const event = createDomainEvent({ ...eventData });
		expect(event).toEqual(eventData);
	});

	it('adds the timestamp if not provided', () => {
		const { name, aggregateId, version } = eventData;
		const beforeCreation = Date.now();
		const event = createDomainEvent({ name, aggregateId, version });
		const afterCreation = Date.now();
		expect(event).toMatchObject({
			name,
			aggregateId,
			version,
			timestamp: expect.any(Number),
		});
		expect(event.timestamp).toBeGreaterThanOrEqual(beforeCreation);
		expect(event.timestamp).toBeLessThanOrEqual(afterCreation);
		expect(event.payload).toBeUndefined();
		expect(event.meta).toBeUndefined();
	});
});

describe('createDomainCommand', () => {
	const commandData: DomainCommand = {
		name: 'A_USER_INTENTION',
		payload: {
			whatever: 'anything',
		},
		meta: {
			timestamp: Date.now(),
		},
	};

	it('generates a new DomainCommand when called properly', () => {
		const command = createDomainCommand({ ...commandData });
		expect(command).toEqual(commandData);
	});

	it('adds the timestamp in the meta if none is provided', () => {
		const { name } = commandData;
		const beforeCreation = Date.now();
		const command = createDomainCommand({ name });
		const afterCreation = Date.now();
		expect(command).toMatchObject({
			name,
			meta: {
				timestamp: expect.any(Number),
			},
		});
		const {
			meta: { timestamp },
		} = command;
		expect(timestamp).toBeGreaterThanOrEqual(beforeCreation);
		expect(timestamp).toBeLessThanOrEqual(afterCreation);
		expect(command.payload).toBeUndefined();
	});
});
