import type { AsPictureModule } from '$lib/AsPictureModule';
import type { Image } from '$lib/Image';
import { pathToID } from '$lib/pathToID';

export function getAllPhotos(): Image[] {
	return Object.entries<AsPictureModule>(
		import.meta.glob('$lib/assets/photos/*', {
			import: 'default',
			eager: true,
			query: {
				as: 'picture',
				format: 'webp',
				w: [100, 400, 800, 1600, 2400].join(';')
			}
		})
	).map<Image>(([path, { sources, img }]) => ({
		id: pathToID(path),
		srcset: Object.values(sources)[0]
			.map((_) => `${_.src} ${_.w}w`)
			.join(', '),
		src: img.src,
		width: img.w,
		height: img.h
	}));
}
