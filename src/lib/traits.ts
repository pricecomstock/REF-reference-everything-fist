import traitsJSON from './json/traits.json';
import { mapByField } from './util';

export type Stats = {
	FRC?: number;
	TAC?: number;
	CRE?: number;
	RFX?: number;
	CHOSEN_ATTRIBUTE?: number;
	MAX_HP?: number;
	WAR_DIE_PER_MISSION?: number;
	WAR_DIE_RESULT_BONUS?: number;
	DAMAGE?: number;
	ARMOR?: number;
};

export const STAT_NAMES = {
	FRC: 'FORCEFUL',
	TAC: 'TACTICAL',
	CRE: 'CREATIVE',
	RFX: 'REFLEXIVE',
	CHOSEN_ATTRIBUTE: 'to chosen attribute',
	MAX_HP: 'MAX HP',
	WAR_DIE_PER_MISSION: 'WAR DICE per mission',
	WAR_DIE_RESULT_BONUS: 'when you roll WAR DICE',
	DAMAGE: 'DAMAGE',
	ARMOR: 'ARMOR'
};

export const STAT_ABBREVIATIONS = Object.fromEntries(
	Object.entries(STAT_NAMES).map(([abbr, name]) => [name, abbr])
);

type RawTrait = {
	number: number;
	name: string;
	effect: string;
	item: string;
	stat: string;
};

export type Trait = RawTrait & {
	stats: Stats;
};

export function parseStatString(statString: string): Stats {
	const [modifier, ...statTokens] = statString.split(' ');
	const statName = statTokens.join(' ');

	let stats: Stats = {};
	if (statName) {
		if (['TACTICAL', 'REFLEXIVE', 'FORCEFUL', 'CREATIVE'].includes(statName)) {
			stats = {
				[STAT_ABBREVIATIONS[statName]]: parseInt(modifier, 10)
			};
		} else if (statName.startsWith('MAX HP')) {
			stats.MAX_HP = parseInt(modifier, 10);
		} else if (statName.startsWith('DAMAGE')) {
			stats.DAMAGE = parseInt(modifier, 10);
		} else if (statName.startsWith('ARMOR') || statName.startsWith('to ARMOR')) {
			stats.ARMOR = parseInt(modifier, 10);
		} else if (statName.startsWith('to chosen attribute')) {
			stats.CHOSEN_ATTRIBUTE = parseInt(modifier, 10);
		} else if (statName.startsWith('WAR DIE per mission')) {
			stats.WAR_DIE_PER_MISSION = parseInt(modifier, 10);
		} else if (statName.startsWith('when you roll WAR DICE')) {
			stats.WAR_DIE_RESULT_BONUS = parseInt(modifier, 10);
		} else {
			console.error('Unknown stat:', modifier, statName);
		}
	}

	return stats;
}

const rawTraits: RawTrait[] = traitsJSON;

export const traits: Trait[] = rawTraits.map((trait) => ({
	...trait,
	stats: parseStatString(trait.stat)
}));

export const traitsByNumber = mapByField(traits, 'number');
export const traitsByName = mapByField(traits, 'name');

export function getTraitByNumber(n: number) {
	return traitsByNumber.get(n);
}

export function getTraitByName(name: string) {
	return traitsByName.get(name.toUpperCase());
}

export function getRandomTrait() {
	return traits[Math.floor(Math.random() * traits.length)];
}
