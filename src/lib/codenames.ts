import codenamesJSON from './json/codenames.json';

export const codenames: string[] = codenamesJSON;

export function getRandomCodename() {
	return codenames[Math.floor(Math.random() * codenames.length)];
}
