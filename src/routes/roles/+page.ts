import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		title: 'Roles Index'
	};
}) satisfies PageLoad;
