import { browser } from '$app/environment';
import { readable } from 'svelte/store';

declare global {
	interface Document {
		startViewTransition?(callback: () => void | PromiseLike<void>): {
			updateCallbackDone: PromiseLike<void>;
			ready: PromiseLike<void>;
			finished: PromiseLike<void>;
			skipTransition(): void;
		};
	}
}

const getHash = () => (browser ? window.location.hash : '');

interface HashTransition {
	transition: 'starting' | 'running' | 'finished';
	prevHash: string;
	currentHash: string;
}

export const hash = readable<HashTransition>(
	{
		transition: 'finished',
		prevHash: getHash(),
		currentHash: getHash()
	},

	(set, update) => {
		if (!browser) return;

		const listening = new AbortController();

		const hashChanging$ = {
			current: new AbortController()
		};

		window.addEventListener(
			'hashchange',
			async () => {
				const currentHash = getHash();

				if (!document.startViewTransition) {
					update((_) => ({
						transition: 'finished',
						prevHash: _.currentHash,
						currentHash
					}));
					return;
				}

				hashChanging$.current.abort();

				const changing = new AbortController();
				const aborted = () => changing.signal.aborted;

				hashChanging$.current = changing;

				update((_) => ({
					transition: 'starting',
					prevHash: _.currentHash,
					currentHash
				}));

				if (aborted()) return;

				const transition = document.startViewTransition(() => {
					if (aborted()) return;

					update((_) => ({
						..._,
						transition: 'running'
					}));
				});

				await transition.updateCallbackDone;

				if (aborted()) {
					transition.skipTransition();
					return;
				}

				await transition.ready;

				if (aborted()) {
					transition.skipTransition();
					return;
				}

				await transition.finished;

				if (aborted()) return;

				update((_) => ({
					..._,
					transition: 'finished'
				}));
			},
			{
				passive: true,
				signal: listening.signal
			}
		);

		return () => {
			listening.abort();
		};
	}
);
