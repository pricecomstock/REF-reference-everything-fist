import { traits } from '$lib/traits';
import type { PageLoad } from '../$types';

export const load = (async () => {
	return {
		traits,
		title: 'Traits Index'
	};
}) satisfies PageLoad;
