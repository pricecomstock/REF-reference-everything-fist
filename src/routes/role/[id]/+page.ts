import { getRoleByName, getRoleByNumber } from '$lib/roles';
import { getCommunityRoleBySlug, loadCommunityRoles } from '$lib/community';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	// Check if ID starts with 'c-' for community role slug
	if (params.id.startsWith('cr-')) {
		await loadCommunityRoles();
		const role = getCommunityRoleBySlug(params.id);

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
}) satisfies PageLoad;
