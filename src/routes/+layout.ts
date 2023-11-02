import { roles } from '$lib/roles';
import { traits } from '$lib/traits';
import type { LayoutLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		traits,
		roles
	};
}) satisfies LayoutLoad;
