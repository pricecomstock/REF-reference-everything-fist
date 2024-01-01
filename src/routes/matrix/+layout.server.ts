import type { LayoutServerLoad } from './$types';
import { standardMatrices } from '$lib/matrix';

export const load = (async ({ params }) => {
	return {
		standardMatrices
	};
}) satisfies LayoutServerLoad;
