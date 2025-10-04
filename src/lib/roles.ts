import rolesJSON from './json/roles.json';
import { mapByField } from './util';

export type Role = {
	number: number;
	name: string;
	text: string;
};

export type CommunityRole = Role & {
	author: string;
};

export const roles: Role[] = rolesJSON;

export const rolesByNumber = mapByField(roles, 'number');
export const rolesByName = mapByField(roles, 'name');

export function getRoleByNumber(n: number) {
	return rolesByNumber.get(n);
}

export function getRoleByName(name: string) {
	return rolesByName.get(name.toUpperCase());
}

export function getRandomRole() {
	return roles[Math.floor(Math.random() * roles.length)];
}
