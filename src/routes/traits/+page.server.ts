import { traits } from '$lib/traits';
import type { PageLoad } from '../$types';

export const load = (async () => {
	return {
		traits
	};
}) satisfies PageLoad;
