import type { Trait, Role } from '$lib/traits';
import { parseStatString } from '$lib/traits';

let communityTraits: Trait[] | null = null;
let communityRoles: Role[] | null = null;

export async function loadCommunityTraits(): Promise<Trait[]> {
	if (communityTraits) return communityTraits;

	const module = await import('./json/community_traits.json');
	const rawTraits = module.default;

	communityTraits = rawTraits.map((trait: any) => ({
		...trait,
		stats: parseStatString(trait.stat)
	}));

	return communityTraits;
}

export async function loadCommunityRoles(): Promise<Role[]> {
	if (communityRoles) return communityRoles;

	const module = await import('./json/community_roles.json');
	communityRoles = module.default;

	return communityRoles;
}

export function getCommunityTraitsSync(): Trait[] | null {
	return communityTraits;
}

export function getCommunityRolesSync(): Role[] | null {
	return communityRoles;
}
