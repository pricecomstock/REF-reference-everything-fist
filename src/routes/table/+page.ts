import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		title: 'Dice Table'
	};
}) satisfies PageLoad;
