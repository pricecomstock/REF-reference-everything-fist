import { getRandomRole } from '$lib/roles';
import { getRandomTrait } from '$lib/traits';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		codename: '???',
		role: getRandomRole(),
		traits: [getRandomTrait(), getRandomTrait()]
	};
}) satisfies PageServerLoad;
