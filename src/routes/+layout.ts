import { toPhotos, type ImageMeta } from '$lib/toPhotos';
import type { LayoutLoad } from './$types';

export const load = (async () => {
	const photos = toPhotos(
		import.meta.glob<ImageMeta | ImageMeta[]>('$lib/assets/photos/*', {
			import: 'default',
			eager: true,
			query: {
				as: `meta:${(['src', 'width', 'height'] satisfies (keyof ImageMeta)[]).join(';')}`,
				format: 'webp',
				w: [100, 400, 800, 1600, 2400].join(';')
			}
		})
	);

	return {
		photos
	};
}) satisfies LayoutLoad;

export const prerender = true;
export const trailingSlash = 'always';
