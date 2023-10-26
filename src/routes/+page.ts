import { traits } from '$lib/traits';
import { roles } from '$lib/roles';
import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		traits,
		roles
	};
}) satisfies PageLoad;
