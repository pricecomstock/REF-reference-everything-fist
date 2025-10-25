import { codenames } from '$lib/codenames';
import { roles } from '$lib/roles';
import { traits } from '$lib/traits';
import { loadCommunityTraits, loadCommunityRoles } from '$lib/community';
import type { Trait } from '$lib/traits';
import type { Role } from '$lib/roles';

import type { Merc } from '$lib/mercs';

import { DeckRandomizer } from '$lib/randUtil';

import { writable } from 'svelte/store';
import { communityEnabled } from '$lib/stores/communityPreferences';

const codenamesDeck = new DeckRandomizer([...codenames]);
let traitsDeck = new DeckRandomizer([...traits]);
let rolesDeck = new DeckRandomizer([...roles]);

let communityTraits: Trait[] = [];
let communityRoles: Role[] = [];

export const merc = writable<Merc>({
	codename: '',
	role: { name: '', number: 0, text: '' },
	traits: [{ name: '', number: 0, effect: '', item: '', stat: '', stats: {} }]
});

export function rerollMerc() {
	merc.set({
		codename: codenamesDeck.draw(),
		role: rolesDeck.draw(),
		traits: [traitsDeck.draw(), traitsDeck.draw()]
	});
}

export function rerollCodename() {
	merc.update((m) => {
		m.codename = codenamesDeck.draw();
		return m;
	});
}

export function rerollRole() {
	merc.update((m) => {
		m.role = rolesDeck.draw();
		return m;
	});
}

export function rerollTrait(index: number) {
	merc.update((m) => {
		if (index < m.traits.length) {
			m.traits[index] = traitsDeck.draw();
		}
		return m;
	});
}

// Subscribe to community preference changes to update decks
communityEnabled.subscribe(async (enabled) => {
	if (enabled) {
		// Load community data if not already loaded
		if (communityTraits.length === 0) {
			communityTraits = await loadCommunityTraits();
		}
		if (communityRoles.length === 0) {
			communityRoles = await loadCommunityRoles();
		}

		// Recreate decks with community content
		traitsDeck = new DeckRandomizer([...traits, ...communityTraits]);
		rolesDeck = new DeckRandomizer([...roles, ...communityRoles]);
	} else {
		// Reset decks to vanilla only
		traitsDeck = new DeckRandomizer([...traits]);
		rolesDeck = new DeckRandomizer([...roles]);
	}
});
