import { pathToID } from '$lib/pathToID';
import { toPhotos, type ImageMeta } from '$lib/toPhotos';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import type { PageServerLoad as PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { photos } = await parent();

	// ls -1 src/lib/assets/texts | xargs -I{} basename {} .md | xargs -I{} echo '|'\'{}\' | pbcopy
	type AllTexts =
		| 'hero'
		| 'interview'
		| 'message'
		| 'our-history'
		| 'our-photos'
		| 'profile-bride'
		| 'profile-groom';

	const texts = Object.fromEntries(
		Object.entries(
			import.meta.glob<string>('$lib/assets/texts/*.md', {
				import: 'default',
				eager: true,
				as: 'raw'
			})
		).map(([path, mdBody]) => [
			pathToID(path),
			micromark(mdBody, {
				extensions: [gfm()],
				htmlExtensions: [gfmHtml()]
			})
		])
	) as Record<AllTexts, string>;

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
