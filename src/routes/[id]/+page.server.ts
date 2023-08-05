import { toPhotos, type ImageMeta } from '$lib/toPhotos';
import { error } from '@sveltejs/kit';
import type { PageServerLoad as PageLoad } from './$types';

export const load = (async ({ params: { id } }) => {
	const photos = toPhotos(
		// 別の $lib/assets/photos/* のimportとqueryなどまったく同じにしないといけない
		// FIXME 関数共通化
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

	const photo = photos.find((_) => _.id === id);
	if (!photo) {
		throw error(404, 'not found');
	}

	return {
		photo
	};
}) satisfies PageLoad;
