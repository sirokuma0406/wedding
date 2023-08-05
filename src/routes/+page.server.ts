import { loadTexts } from '$lib/server/loadTexts';
import { toPhotos, type ImageMeta } from '$lib/toPhotos';
import type { PageServerLoad as PageLoad } from './$types';

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
	).map(({ id, thumbnail, placeholder }) => ({
		id,
		thumbnail,
		placeholder
	}));

	const texts = loadTexts();

	const hero = toPhotos(
		import.meta.glob<ImageMeta | ImageMeta[]>('$lib/assets/images/hero.*', {
			import: 'default',
			eager: true,
			query: {
				as: `meta:${(['src', 'width', 'height'] satisfies (keyof ImageMeta)[]).join(';')}`,
				format: 'webp',
				w: [400, 800, 1600].join(';')
			}
		})
	)[0];

	const { groom, bride } = Object.fromEntries(
		toPhotos(
			import.meta.glob<ImageMeta | ImageMeta[]>('$lib/assets/images/{groom,bride}.*', {
				import: 'default',
				eager: true,
				query: {
					as: `meta:${(['src', 'width', 'height'] satisfies (keyof ImageMeta)[]).join(';')}`,
					format: 'webp',
					w: [100, 250, 500].join(';'),
					aspect: '4:3'
				}
			})
		).map((_) => [_.id, _])
	);

	const bg2 = Object.values(
		import.meta.glob<string>('$lib/assets/images/bg2.*', {
			import: 'default',
			eager: true,
			query: {
				w: 400,
				h: 400,
				position: 'left',
				brightness: 0.5
			}
		})
	)[0];

	return {
		texts,
		photos,
		images: {
			hero,
			groom,
			bride,
			bg2
		}
	};
}) satisfies PageLoad;
