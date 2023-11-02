import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		title: 'Random Merc'
	};
}) satisfies PageServerLoad;
