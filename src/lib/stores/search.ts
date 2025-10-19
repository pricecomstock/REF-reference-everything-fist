import { derived, writable, get } from 'svelte/store';
import { traits, getTraitByNumber, type Trait, type CommunityTrait } from '$lib/traits';
import { roles, getRoleByNumber, type Role, type CommunityRole } from '$lib/roles';
import { communityTraits, communityRoles, loadAllCommunityContent } from '$lib/community';
import { communityEnabled } from './communityPreferences';

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
	tokenize: 'forward',
	language: 'en',
	encoder: 'balance'
});
const indexCommunityTraits = new Index({
	tokenize: 'forward',
	language: 'en',
	encoder: 'balance'
});
const indexCommunityRoles = new Index({
	tokenize: 'forward',
	language: 'en',
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

// Track whether community indexes have been populated
let communityTraitsIndexed = false;
let communityRolesIndexed = false;

// Index community content when available
communityTraits.subscribe((commTraits) => {
	// Only index if we have traits and haven't indexed them yet
	if (commTraits.length > 0 && !communityTraitsIndexed) {
		for (const trait of commTraits) {
			indexCommunityTraits.add(trait.number, trait.name);
			indexCommunityTraits.append(trait.number, trait.effect);
			indexCommunityTraits.append(trait.number, trait.item);
		}
		communityTraitsIndexed = true;
	}
});

communityRoles.subscribe((commRoles) => {
	// Only index if we have roles and haven't indexed them yet
	if (commRoles.length > 0 && !communityRolesIndexed) {
		console.time('Adding community roles to search');
		for (const role of commRoles) {
			indexCommunityRoles.add(role.number, role.name);
			indexCommunityRoles.append(role.number, role.text);
		}
		communityRolesIndexed = true;
		console.timeEnd('Adding community roles to search');
	}
});

type SearchResults = {
	roles: Role[];
	traits: Trait[];
	communityRoles: CommunityRole[];
	communityTraits: CommunityTrait[];
};

export const searchResults = derived<[typeof searchQuery, typeof communityEnabled], SearchResults>(
	[searchQuery, communityEnabled],
	([query, includeComm], set) => {
		const emptyResult: SearchResults = {
			roles: [],
			traits: [],
			communityRoles: [],
			communityTraits: []
		};

		// If the user types in a number, we just fetch that if we can
		if (Number(query)) {
			const trait = getTraitByNumber(Number(query));
			const role = getRoleByNumber(Number(query));

			if (trait || role) {
				set({
					roles: role ? [role] : [],
					traits: trait ? [trait] : [],
					communityRoles: [],
					communityTraits: []
				});
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

		let resultCommunityTraits: CommunityTrait[] = [];
		let resultCommunityRoles: CommunityRole[] = [];

		if (includeComm) {
			loadAllCommunityContent();
			const commTraits = get(communityTraits);
			const commRoles = get(communityRoles);

			resultCommunityTraits = (indexCommunityTraits.search(query, 8, { suggest: true }) as number[])
				.map((num) => commTraits.find((t) => t.number === num))
				.filter(Boolean) as CommunityTrait[];

			resultCommunityRoles = (indexCommunityRoles.search(query, 5, { suggest: true }) as number[])
				.map((num) => commRoles.find((r) => r.number === num))
				.filter(Boolean) as CommunityRole[];
		}

		set({
			roles: [...new Set(resultRoles)],
			traits: [...new Set(resultTraits)],
			communityRoles: [...new Set(resultCommunityRoles)],
			communityTraits: [...new Set(resultCommunityTraits)]
		});
	}
);
