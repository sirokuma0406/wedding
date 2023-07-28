import { derived } from 'svelte/store';
import { hash } from './hash';

interface TransitionTarget {
	navigationType: 'initial' | 'to-photo' | 'to-thumbnails' | 'switch-photo';
	targetID: `photo-${string}` | `thumbnail-${string}` | undefined;
}

export const transitionTarget = derived<typeof hash, TransitionTarget>(hash, ($hash, set) => {
	const { transition } = $hash;
	const prev = $hash.prevHash.slice('#'.length);
	const current = $hash.currentHash.slice('#'.length);

	let navigationType: TransitionTarget['navigationType'] = 'initial';

	if (prev === '' && current !== '') {
		navigationType = 'to-photo';
	} else if (prev !== '' && current === '') {
		navigationType = 'to-thumbnails';
	} else if (prev === current) {
		navigationType = 'initial';
	} else {
		navigationType = 'switch-photo';
	}

	let targetID: TransitionTarget['targetID'];

	switch (navigationType) {
		case 'initial': {
			targetID = current ? `photo-${current}` : undefined;
			break;
		}

		case 'to-photo': {
			switch (transition) {
				case 'starting': {
					targetID = `thumbnail-${current}`;
					break;
				}

				case 'running':
				case 'finished': {
					targetID = `photo-${current}`;
					break;
				}
			}
			break;
		}

		case 'to-thumbnails': {
			switch (transition) {
				case 'starting': {
					targetID = `photo-${prev}`;
					break;
				}

				case 'running': {
					targetID = `thumbnail-${prev}`;
					break;
				}

				case 'finished': {
					targetID = undefined;
					break;
				}
			}
			break;
		}

		case 'switch-photo': {
			switch (transition) {
				case 'starting': {
					targetID = `photo-${prev}`;
					break;
				}

				case 'running':
				case 'finished': {
					targetID = `photo-${current}`;
					break;
				}
			}
			break;
		}
	}

	set({
		navigationType,
		targetID
	});
});
