import { writable } from 'svelte/store';
import type { CommunityTrait } from '$lib/traits';
import type { CommunityRole } from '$lib/roles';
import { parseStatString } from '$lib/traits';

interface RawCommunityTrait {
	number: number;
	name: string;
	effect: string;
	item: string;
	stat: string;
	author: string;
	slug: string;
}

// Stores for community content
export const communityTraits = writable<CommunityTrait[]>([]);
export const communityRoles = writable<CommunityRole[]>([]);
export const communityLoaded = writable(false);

let traitsCache: CommunityTrait[] | null = null;
let rolesCache: CommunityRole[] | null = null;

export async function loadCommunityTraits(): Promise<CommunityTrait[]> {
	if (traitsCache) return traitsCache;

	const module = await import('./json/community_traits.json');
	const rawTraits = module.default as RawCommunityTrait[];

	traitsCache = rawTraits.map((trait) => ({
		...trait,
		stats: parseStatString(trait.stat)
	}));

	communityTraits.set(traitsCache);
	return traitsCache;
}

export async function loadCommunityRoles(): Promise<CommunityRole[]> {
	if (rolesCache) return rolesCache;

	const module = await import('./json/community_roles.json');
	rolesCache = module.default;

	communityRoles.set(rolesCache);
	return rolesCache;
}

export async function loadAllCommunityContent(): Promise<void> {
	await Promise.all([loadCommunityTraits(), loadCommunityRoles()]);
	communityLoaded.set(true);
}

export function getCommunityTraitsSync(): CommunityTrait[] | null {
	return traitsCache;
}

export function getCommunityRolesSync(): CommunityRole[] | null {
	return rolesCache;
}
