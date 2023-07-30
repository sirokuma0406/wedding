import type { AsPictureModule } from '$lib/AsPictureModule';
import type { Image } from '$lib/Image';
import { getAllPhotos } from '$lib/getAllPhotos';
import { getAllThumbnails } from '$lib/getAllThumbnails';
import { pathToID } from '$lib/pathToID';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import type { PageServerLoad } from './$types';

// ls -1 src/lib/assets/texts | xargs -I{} basename {} .md | xargs -I{} echo \'{}\', | pbcopy
const allTexts = [
	'hero',
	'interview',
	'message',
	'our-history',
	'our-photos',
	'profile-bride',
	'profile-groom'
] as const;

type AllTexts = (typeof allTexts)[number];

export const load = (async () => {
	const texts = Object.fromEntries(
		await Promise.all(
			allTexts.map(async (id) => {
				const mdBody = await import(`$lib/assets/texts/${id}.md?raw`).then(
					(_) => _.default as string
				);

				return [
					id,
					micromark(mdBody, {
						extensions: [gfm()],
						htmlExtensions: [gfmHtml()]
					})
				] as const;
			})
		)
	) as Record<AllTexts, string>;

	const photos = getAllPhotos();
	const thumbnails = getAllThumbnails();

	const hero = Object.values<AsPictureModule<'webp'>>(
		import.meta.glob('$lib/assets/images/hero.*', {
			import: 'default',
			eager: true,
			query: {
				as: 'picture',
				format: 'webp',
				w: [400, 800, 1600].join(';')
			}
		})
	).map<Omit<Image, 'id'>>(({ sources, img }) => ({
		srcset: sources.webp?.map((_) => `${_.src} ${_.w}w`).join(', '),
		src: img.src,
		width: img.w,
		height: img.h
	}))[0];

	const { groom, bride } = Object.fromEntries(
		Object.entries<AsPictureModule<'webp'>>(
			import.meta.glob('$lib/assets/images/{groom,bride}.*', {
				import: 'default',
				eager: true,
				query: {
					as: 'picture',
					format: 'webp',
					w: [250, 500].join(';'),
					aspect: '4:3'
				}
			})
		).map<[string, Omit<Image, 'id'>]>(([path, { sources, img }]) => [
			pathToID(path),
			{
				srcset: sources.webp?.map((_) => `${_.src} ${_.w}w`).join(', '),
				src: img.src,
				width: img.w,
				height: img.h
			}
		])
	);

	const bg2 = Object.values<string>(
		import.meta.glob('$lib/assets/images/bg2.*', {
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
		thumbnails,
		images: {
			hero,
			groom,
			bride,
			bg2
		}
	};
}) satisfies PageServerLoad;
