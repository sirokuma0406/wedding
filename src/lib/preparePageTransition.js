import { beforeNavigate, goto } from '$app/navigation';
import { navigating } from '$app/stores';
import { onDestroy } from 'svelte';

function getNavigationStore() {
	/** @type {((val?: any) => void)[]} */
	let callbacks = [];

	const navigation = {
		...navigating,
		complete: async () => {
			await new Promise((res, _) => {
				callbacks.push(res);
			});
		}
	};

	// This used to subscribe inside the callback, but that resolved the promise too early
	const unsub = navigating.subscribe((n) => {
		if (n === null) {
			while (callbacks.length > 0) {
				const res = callbacks.pop();
				res?.();
			}
		}
	});

	onDestroy(() => {
		unsub();
	});

	return navigation;
}

export const preparePageTransition = () => {
	const navigation = getNavigationStore();

	// before navigating, start a new transition
	beforeNavigate((n) => {
		if (!document.startViewTransition) {
			return;
		}

		// console.log(n.type);
		if (n.type === 'goto') return;
		console.log('type', n.type);
		if (n.type === 'link' && n.to) {
			console.log('type=link', n.from, n.to, n.willUnload);

			n.cancel();
			const href = n.to.url.href;

			document.startViewTransition(async () => {
				await goto(href);
			});

			return;
		}

		const navigationComplete = navigation.complete();

		document.startViewTransition(async () => {
			await navigationComplete;
		});
	});
};
