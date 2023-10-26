export function mapByField<T, F extends keyof T>(arr: T[], field: F): Map<T[F], T> {
	return new Map(arr.map((item) => [item[field], item]));
}
