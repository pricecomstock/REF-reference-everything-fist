import type { Role } from './roles';
import type { Trait } from './traits';

export type Merc = {
	codename: string;
	role: Role;
	traits: Trait[];
};
