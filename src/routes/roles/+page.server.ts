import { roles } from '$lib/roles';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		title: 'Roles Index',
		roles
	};
}) satisfies PageServerLoad;
