import { getRandomRole } from '$lib/roles';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const randomRole = getRandomRole();
	throw redirect(307, `/role/${randomRole.name.toLowerCase()}`);
}) satisfies PageServerLoad;
