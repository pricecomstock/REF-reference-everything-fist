export function mapByField<T, F extends keyof T>(arr: T[], field: F): Map<T[F], T> {
	return new Map(arr.map((item) => [item[field], item]));
}

export function fuzzySearch(needle: string, haystack: string): boolean {
	const hlen = haystack.length;
	const nlen = needle.length;
	if (nlen > hlen) {
		return false;
	}
	if (nlen === hlen) {
		return needle === haystack;
	}
	outer: for (let i = 0, j = 0; i < nlen; i++) {
		const nch = needle.charCodeAt(i);
		while (j < hlen) {
			if (haystack.charCodeAt(j++) === nch) {
				continue outer;
			}
		}
		return false;
	}
	return true;
}

export function formatTraitRoleNumber(
	n: number,
	isTrait: boolean = true,
	isCommunity: boolean = false
): string {
	// Format community numbers with CT/CR prefix
	if (isCommunity) {
		const prefix = isTrait ? 'CT' : 'CR';
		return `${prefix}${String(n).replace(/(\d{1})(\d+)/, '$1-$2')}`;
	}
	return String(n);
}

export function createCommunitySlug(name: string, author: string): string {
	const slugName = name.toLowerCase().replace(/\s+/g, '-');
	const slugAuthor = author.toLowerCase().replace(/\s+/g, '-');
	return `c-${slugName}-${slugAuthor}`;
}
