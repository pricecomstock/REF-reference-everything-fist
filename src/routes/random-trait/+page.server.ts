import { getRandomTrait } from '$lib/traits';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const randomTrait = getRandomTrait();
	throw redirect(307, `/trait/${randomTrait.name.toLowerCase()}`);
}) satisfies PageServerLoad;
