import rolesJSON from './json/roles.json';
import { mapByField } from './util';

export type Role = {
	number: number;
	name: string;
	text: string;
};

export const roles: Role[] = rolesJSON;

export const rolesByNumber = mapByField(roles, 'number');
export const rolesByName = mapByField(roles, 'name');
