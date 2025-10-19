import { writable } from 'svelte/store';
import type { CommunityTrait } from '$lib/traits';
import type { CommunityRole } from '$lib/roles';
import { parseStatString } from '$lib/traits';
import { mapByField } from '$lib/util';

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
let communityTraitsByNumber: Map<number, CommunityTrait> | null = null;
let communityTraitsBySlug: Map<string, CommunityTrait> | null = null;
let communityRolesByNumber: Map<number, CommunityRole> | null = null;
let communityRolesBySlug: Map<string, CommunityRole> | null = null;

export async function loadCommunityTraits(): Promise<CommunityTrait[]> {
	if (traitsCache) return traitsCache;

	const module = await import('./json/community_traits.json');
	const rawTraits = module.default as RawCommunityTrait[];

	traitsCache = rawTraits.map((trait) => ({
		...trait,
		stats: parseStatString(trait.stat)
	}));

	// Build maps for lookups
	communityTraitsByNumber = mapByField(traitsCache, 'number');
	communityTraitsBySlug = mapByField(traitsCache, 'slug');

	communityTraits.set(traitsCache);
	return traitsCache;
}

export async function loadCommunityRoles(): Promise<CommunityRole[]> {
	if (rolesCache) return rolesCache;

	const module = await import('./json/community_roles.json');
	rolesCache = module.default;

	// Build maps for lookups
	communityRolesByNumber = mapByField(rolesCache, 'number');
	communityRolesBySlug = mapByField(rolesCache, 'slug');

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

export function getCommunityTraitByNumber(n: number): CommunityTrait | undefined {
	return communityTraitsByNumber?.get(n);
}

export function getCommunityTraitBySlug(slug: string): CommunityTrait | undefined {
	return communityTraitsBySlug?.get(slug);
}

export function getCommunityRoleByNumber(n: number): CommunityRole | undefined {
	return communityRolesByNumber?.get(n);
}

export function getCommunityRoleBySlug(slug: string): CommunityRole | undefined {
	return communityRolesBySlug?.get(slug);
}
