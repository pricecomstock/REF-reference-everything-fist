import { getTraitByName, getTraitByNumber, getCommunityTraitBySlug } from '$lib/traits';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	// Check if ID starts with 'c' for community trait slug
	if (params.id.startsWith('c')) {
		const trait = getCommunityTraitBySlug(params.id);

		if (!trait) {
			throw error(404);
		}

		return {
			title: trait.name,
			trait
		};
	}

	const idNumber = Number(params.id);
	if (idNumber) {
		const trait = getTraitByNumber(idNumber);
		throw redirect(301, `/trait/${trait?.name.toLowerCase()}`);
	}

	const trait = getTraitByName(params.id);

	if (!trait) {
		throw error(404);
	}

	return {
		title: trait.name,
		trait
	};
}) satisfies PageServerLoad;
