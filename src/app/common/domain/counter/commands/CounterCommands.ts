import { DomainCommand, DomainId } from '../../../../../lib/DDD_ES/DDD_ES';

export enum CounterCommandNames {
	Add = 'Counter:Command:Add',
	Subtract = 'Counter:Command:Subtract',
	Multiply = 'Counter:Command:Multiply',
	Divide = 'Counter:Command:Divide',
}

export interface CounterCommand extends DomainCommand {
	payload: {
		aggregateId: DomainId;
		howMuch: number;
	};
}
export interface AddCommand extends CounterCommand {
	name: CounterCommandNames.Add;
}

export interface SubtractCommand extends CounterCommand {
	name: CounterCommandNames.Subtract;
}

export interface MultiplyCommand extends CounterCommand {
	name: CounterCommandNames.Multiply;
}

export interface DivideCommand extends CounterCommand {
	name: CounterCommandNames.Divide;
}
