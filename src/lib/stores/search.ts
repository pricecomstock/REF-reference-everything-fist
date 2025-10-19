import { derived, writable, get } from 'svelte/store';
import { traits, getTraitByNumber, type Trait, type CommunityTrait } from '$lib/traits';
import { roles, getRoleByNumber, type Role, type CommunityRole } from '$lib/roles';
import { communityTraits, communityRoles, loadAllCommunityContent } from '$lib/community';
import { communityEnabled } from './communityPreferences';

import type { Index } from 'flexsearch';

export const isSearching = writable(false);
export const searchQuery = writable('');

isSearching.subscribe((val) => {
	if (val) {
		searchQuery.set('');
	}
});

// Lazy-loaded FlexSearch and indexes
let FlexSearchIndex: any = null;
let indexTraits: Index | null = null;
let indexRoles: Index | null = null;
let indexCommunityTraits: Index | null = null;
let indexCommunityRoles: Index | null = null;
let indexesInitialized = false;
let communityTraitsIndexed = false;
let communityRolesIndexed = false;

// Lazy load FlexSearch and initialize indexes
async function initializeSearch() {
	if (indexesInitialized) return;

	console.time('Loading FlexSearch library');
	const flexsearch = await import('flexsearch');
	console.timeEnd('Loading FlexSearch library');

	// @ts-expect-error tbh not sure about this one but sk had it in their code.
	FlexSearchIndex = flexsearch.default.Index ?? flexsearch.default;

	console.time('Setting up search indexes');

	// Initialize indexes
	indexTraits = new FlexSearchIndex({
		tokenize: 'forward',
		language: 'en',
		encoder: 'balance'
	});
	indexRoles = new FlexSearchIndex({
		tokenize: 'forward',
		language: 'en',
		encoder: 'balance'
	});
	indexCommunityTraits = new FlexSearchIndex({
		tokenize: 'forward',
		language: 'en',
		encoder: 'balance'
	});
	indexCommunityRoles = new FlexSearchIndex({
		tokenize: 'forward',
		language: 'en',
		encoder: 'balance'
	});

	// Build main indexes
	for (const trait of traits) {
		indexTraits.add(trait.number, trait.name);
		indexTraits.append(trait.number, trait.effect);
		indexTraits.append(trait.number, trait.item);
	}

	for (const role of roles) {
		indexRoles.add(role.number, role.name);
		indexRoles.append(role.number, role.text);
	}

	console.timeEnd('Setting up search indexes');
	indexesInitialized = true;
}

// Build community indexes when needed
async function ensureCommunityIndexes() {
	if (!indexesInitialized) await initializeSearch();
	if (!indexCommunityTraits || !indexCommunityRoles) return;

	const commTraits = get(communityTraits);
	const commRoles = get(communityRoles);

	// Index community traits if we have them and haven't indexed yet
	if (commTraits.length > 0 && !communityTraitsIndexed) {
		console.time('Indexing community traits');
		for (const trait of commTraits) {
			indexCommunityTraits.add(trait.number, trait.name);
			indexCommunityTraits.append(trait.number, trait.effect);
			indexCommunityTraits.append(trait.number, trait.item);
		}
		communityTraitsIndexed = true;
		console.timeEnd('Indexing community traits');
	}

	// Index community roles if we have them and haven't indexed yet
	if (commRoles.length > 0 && !communityRolesIndexed) {
		console.time('Indexing community roles');
		for (const role of commRoles) {
			indexCommunityRoles.add(role.number, role.name);
			indexCommunityRoles.append(role.number, role.text);
		}
		communityRolesIndexed = true;
		console.timeEnd('Indexing community roles');
	}
}

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

		// Initialize search and perform search asynchronously
		(async () => {
			// Lazy load FlexSearch and initialize indexes on first search
			await initializeSearch();

			if (!indexTraits || !indexRoles) {
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
				await loadAllCommunityContent();
				await ensureCommunityIndexes();

				const commTraits = get(communityTraits);
				const commRoles = get(communityRoles);

				if (indexCommunityTraits && indexCommunityRoles) {
					resultCommunityTraits = (
						indexCommunityTraits.search(query, 8, { suggest: true }) as number[]
					)
						.map((num) => commTraits.find((t) => t.number === num))
						.filter(Boolean) as CommunityTrait[];

					resultCommunityRoles = (indexCommunityRoles.search(query, 5, { suggest: true }) as number[])
						.map((num) => commRoles.find((r) => r.number === num))
						.filter(Boolean) as CommunityRole[];
				}
			}

			set({
				roles: [...new Set(resultRoles)],
				traits: [...new Set(resultTraits)],
				communityRoles: [...new Set(resultCommunityRoles)],
				communityTraits: [...new Set(resultCommunityTraits)]
			});
		})();
	}
);
