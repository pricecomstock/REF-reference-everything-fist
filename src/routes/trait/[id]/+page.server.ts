import { getTraitByName, getTraitByNumber } from '$lib/traits';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }: { id: number | string }) => {
	const idNumber = Number(params.id);
	if (idNumber) {
		const trait = getTraitByNumber(idNumber);
		throw redirect(301, `/trait/${trait?.name.toLowerCase()}`);
	}

	const trait = getTraitByName(params.id);

	return {
		trait
	};
}) satisfies PageServerLoad;
