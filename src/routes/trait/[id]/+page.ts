import { getTraitByName, getTraitByNumber } from '$lib/traits';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const idNumber = Number(params.id);
	if (idNumber) {
		const trait = getTraitByNumber(idNumber);
		throw redirect(301, `/trait/${trait?.name.toLowerCase()}`);
	}

	const trait = getTraitByName(params.id);

	return {
		trait
	};
}) satisfies PageLoad;
