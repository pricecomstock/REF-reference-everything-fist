import { getRoleByName, getRoleByNumber, getCommunityRoleByNumber } from '$lib/roles';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	// Check if ID starts with 'C' or 'c' for community roles
	if (params.id.match(/^[Cc]\d+$/)) {
		const communityNumber = Number(params.id.slice(1));
		const role = getCommunityRoleByNumber(communityNumber);

		if (!role) {
			throw error(404);
		}

		return {
			title: role.name,
			role
		};
	}

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
