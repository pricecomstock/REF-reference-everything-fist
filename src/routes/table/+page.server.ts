import type { PageServerLoad } from './$types';
import { traits } from '$lib/traits';
import { roles } from '$lib/roles';

export const load = (async () => {
	return {
		title: 'Dice Table',
		traits,
		roles
	};
}) satisfies PageServerLoad;
