import { codenames } from '$lib/codenames';
import { roles } from '$lib/roles';
import { traits } from '$lib/traits';

import type { Merc } from '$lib/mercs';

import { DeckRandomizer } from '$lib/randUtil';

import { writable } from 'svelte/store';

const codenamesDeck = new DeckRandomizer([...codenames]);
const traitsDeck = new DeckRandomizer([...traits]);
const rolesDeck = new DeckRandomizer([...roles]);

export const merc = writable<Merc>({
	codename: '',
	role: { name: '', number: 0, text: '' },
	traits: [{ name: '', number: 0, effect: '', item: '', stat: '', stats: {} }]
});

merc.subscribe((m) => {
	console.log('Merc updated', m);
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
