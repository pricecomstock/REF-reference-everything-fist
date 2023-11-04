import { derived, writable } from 'svelte/store';
import { traits, getTraitByNumber, type Trait } from '$lib/traits';
import { roles, getRoleByNumber, type Role } from '$lib/roles';

import flexsearch, { type Index } from 'flexsearch';

export const isSearching = writable(false);
export const searchQuery = writable('');

isSearching.subscribe((val) => {
	if (val) {
		searchQuery.set('');
	}
});

// @ts-expect-error tbh not sure about this one but sk had it in their code.
const Index = flexsearch.Index ?? flexsearch;

// export const inited = false;

const indexTraits = new Index({
	tokenize: 'forward', // index parts of words from beginning
	language: 'en', // use english defaults
	encoder: 'balance'
});
const indexRoles = new Index({
	tokenize: 'forward', // index parts of words from beginning
	language: 'en', // use english defaults
	encoder: 'balance'
});

console.time('Setting up search index');

for (const trait of traits) {
	indexTraits.add(trait.number, trait.name);
	indexTraits.append(trait.number, trait.effect);
	indexTraits.append(trait.number, trait.item);
}

for (const role of roles) {
	indexRoles.add(role.number, role.name);
	indexRoles.append(role.number, role.text);
}

console.timeEnd('Setting up search index');

export const searchResults = derived<typeof searchQuery, { roles: Role[]; traits: Trait[] }>(
	searchQuery,
	(query, set) => {
		const emptyResult: { roles: Role[]; traits: Trait[] } = { roles: [], traits: [] };

		// If the user types in a number, we just fetch that if we can
		if (Number(query)) {
			const trait = getTraitByNumber(Number(query));
			const role = getRoleByNumber(Number(query));

			if (trait || role) {
				set({ roles: role ? [role] : [], traits: trait ? [trait] : [] });
				return;
			}
		}

		// If the query is too short, don't run search
		if (!query || query.length < 3) {
			set(emptyResult);
			return;
		}

		const resultTraits = (indexTraits.search(query, 8, { suggest: true }) as number[])
			.map(getTraitByNumber)
			.filter(Boolean) as Trait[];
		const resultRoles = (indexRoles.search(query, 5, { suggest: true }) as number[])
			.map(getRoleByNumber)
			.filter(Boolean) as Role[];

		const searchResults = { roles: [...new Set(resultRoles)], traits: [...new Set(resultTraits)] };

		// for (const result of results) {
		// 	const trait = getTraitByNumber(result);
		// 	if (trait) {
		// 		searchResults.push({
		// 			priority: 1,
		// 			trait
		// 		});
		// 	}

		// 	const role = getRoleByNumber(result);
		// 	if (role) {
		// 		searchResults.push({
		// 			priority: 2,
		// 			role
		// 		});
		// 	}
		// }

		// searchResults.sort((a, b) => a.priority - b.priority);

		set(searchResults);
	}
);
