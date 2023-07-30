import { pathToID } from '$lib/pathToID';

export interface ImageMeta {
	src: string;
	width: number;
	height: number;
}

interface Photo {
	id: string;
	full: Image;
	thumbnail: Image;
	placeholder: Image;
}

interface Image {
	src: string;
	width: number;
	height: number;
	srcset?: string;
}

export function toPhotos(imported: Record<string, ImageMeta | ImageMeta[]>): Photo[] {
	return Object.entries(imported).map<Photo>(([path, _images]) => {
		const images = Array.isArray(_images) ? _images : [_images];
		images.sort((l, r) => l.width - r.width);

		const thumbnails = images.filter((_) => _.width <= 400);
		const id = pathToID(path);

		return {
			id,
			full: {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				...images.at(-1)!,
				srcset: images.map((_) => `${_.src} ${_.width}w`).join(', ')
			},
			thumbnail: {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				...thumbnails.at(-1)!,
				srcset: thumbnails.map((_) => `${_.src} ${_.width}w`).join(', ')
			},
			placeholder: {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				...thumbnails.at(0)!
			}
		};
	});
}
