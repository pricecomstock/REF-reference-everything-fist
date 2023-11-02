import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		title: 'Traits Index'
	};
}) satisfies PageLoad;
