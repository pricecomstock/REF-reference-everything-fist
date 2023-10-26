import traitsJSON from './json/traits.json';
import { mapByField } from './util';

export type Trait = {
	number: number;
	name: string;
	effect: string;
	item: string;
	stat: string;
};

export const traits: Trait[] = traitsJSON;

export const traitsByNumber = mapByField(traits, 'number');
export const traitsByName = mapByField(traits, 'name');

export function getTraitByNumber(n: number) {
	return traitsByNumber.get(n);
}

export function getTraitByName(name: string) {
	return traitsByName.get(name.toUpperCase());
}
