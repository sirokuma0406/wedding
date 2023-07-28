import type { Image } from '$lib/Image';
import { pathToID } from '$lib/pathToID';

interface AsMetaModule {
	src: string;
	width: number;
	height: number;
}

export function getAllThumbnails(): Image[] {
	return Object.entries<AsMetaModule>(
		import.meta.glob('$lib/assets/photos/*', {
			import: 'default',
			eager: true,
			query: {
				as: `meta:${(['src', 'width', 'height'] satisfies (keyof AsMetaModule)[]).join(';')}`,
				format: 'webp',
				w: 400
			}
		})
	).map<Image>(([path, { src, width, height }]) => ({
		id: pathToID(path),
		src,
		width,
		height
	}));
}
