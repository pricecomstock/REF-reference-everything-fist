import { getRoleByName, getRoleByNumber } from '$lib/roles';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const idNumber = Number(params.id);
	if (idNumber) {
		const role = getRoleByNumber(idNumber);
		throw redirect(301, `/role/${role?.name.toLowerCase()}`);
	}

	const role = getRoleByName(params.id);

	if (!role) {
		throw error(404);
	}

	return {
		title: role.name,
		role
	};
}) satisfies PageServerLoad;
