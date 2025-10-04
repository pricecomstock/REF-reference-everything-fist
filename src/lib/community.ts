import type { CommunityTrait } from '$lib/traits';
import type { CommunityRole } from '$lib/roles';
import { parseStatString } from '$lib/traits';

let communityTraits: CommunityTrait[] | null = null;
let communityRoles: CommunityRole[] | null = null;

interface RawCommunityTrait {
	number: number;
	name: string;
	effect: string;
	item: string;
	stat: string;
	author: string;
}

export async function loadCommunityTraits(): Promise<CommunityTrait[]> {
	if (communityTraits) return communityTraits;

	const module = await import('./json/community_traits.json');
	const rawTraits = module.default as RawCommunityTrait[];

	communityTraits = rawTraits.map((trait) => ({
		...trait,
		stats: parseStatString(trait.stat)
	}));

	return communityTraits;
}

export async function loadCommunityRoles(): Promise<CommunityRole[]> {
	if (communityRoles) return communityRoles;

	const module = await import('./json/community_roles.json');
	communityRoles = module.default;

	return communityRoles;
}

export function getCommunityTraitsSync(): CommunityTrait[] | null {
	return communityTraits;
}

export function getCommunityRolesSync(): CommunityRole[] | null {
	return communityRoles;
}
