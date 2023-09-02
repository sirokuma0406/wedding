import { pathToID } from '$lib/pathToID';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

// ls -1 src/lib/assets/texts | xargs -I{} basename {} .md | xargs -I{} echo '|'\'{}\' | pbcopy
type AllTexts =
	| 'footer'
	| 'hero'
	| 'interview'
	| 'message'
	| 'our-history'
	| 'our-photos'
	| 'profile-bride'
	| 'profile-groom';

export function loadTexts(): Record<AllTexts, string> {
	return Object.fromEntries(
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
}
