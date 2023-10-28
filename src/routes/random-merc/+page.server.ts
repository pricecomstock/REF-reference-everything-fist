import { getRandomCodename } from '$lib/codenames';
import { getRandomRole } from '$lib/roles';
import { getRandomTrait } from '$lib/traits';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const randomTrait1 = getRandomTrait();
	let randomTrait2 = getRandomTrait();
	while (randomTrait1.name === randomTrait2.name) {
		randomTrait2 = getRandomTrait();
	}
	return {
		title: 'Random Merc',
		codename: getRandomCodename(),
		role: getRandomRole(),
		traits: [getRandomTrait(), getRandomTrait()]
	};
}) satisfies PageServerLoad;
