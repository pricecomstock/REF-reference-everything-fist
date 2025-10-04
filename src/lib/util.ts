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

export function formatTraitRoleNumber(n: number): string {
	// Format community numbers differently
	if (n > 1000) {
		return `C${String(n).replace(/(\d{2})(\d+)/, '$1-$2')}`;
	}
	return String(n);
}
