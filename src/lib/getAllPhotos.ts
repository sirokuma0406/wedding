import type { Image } from '$lib/Image';
import { pathToID } from '$lib/pathToID';

interface ImageMeta {
	src: string;
	width: number;
	height: number;
}

interface Photo {
	id: Image['id'];
	full: Image;
	thumbnail: Image;
	placeholder: Image;
}

export function getAllPhotos(): Photo[] {
	const all = import.meta.glob<ImageMeta | ImageMeta[]>('$lib/assets/photos/*', {
		import: 'default',
		eager: true,
		query: {
			as: `meta:${(['src', 'width', 'height'] satisfies (keyof ImageMeta)[]).join(';')}`,
			format: 'webp',
			w: [100, 400, 800, 1600, 2400].join(';')
		}
	});

	return Object.entries(all).map<Photo>(([path, _images]) => {
		const images = Array.isArray(_images) ? _images : [_images];
		images.sort((l, r) => l.width - r.width);

		const thumbnails = images.filter((_) => _.width <= 400);
		const id = pathToID(path);

		return {
			id,
			full: {
				id,
				...images.at(-1)!,
				srcset: images.map((_) => `${_.src} ${_.width}w`).join(', ')
			},
			thumbnail: {
				id,
				...thumbnails.at(-1)!,
				srcset: thumbnails.map((_) => `${_.src} ${_.width}w`).join(', ')
			},
			placeholder: {
				id,
				...thumbnails.at(0)!
			}
		};
	});
}
