export function pathToID(path: string): string {
	return path.match(/[^/]+(?=\.[0-9A-Za-z]+$)/)?.[0] ?? '';
}
