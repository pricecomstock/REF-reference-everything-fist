import { getRoleByName, getRoleByNumber } from '$lib/roles';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const idNumber = Number(params.id);
	if (idNumber) {
		const role = getRoleByNumber(idNumber);
		throw redirect(301, `/role/${role?.name.toLowerCase()}`);
	}

	const role = getRoleByName(params.id);

	return {
		role
	};
}) satisfies PageServerLoad;
