import { beforeNavigate, goto } from '$app/navigation';
import { navigating } from '$app/stores';
import { onDestroy } from 'svelte';

export function preparePageTransition(): void {
	// before navigating, start a new transition
	beforeNavigate((navigation) => {
		if (!document.startViewTransition) return;

		if (navigation.type === 'goto') return;

		if (navigation.type === 'link' && navigation.to) {
			navigation.cancel();

			const href = navigation.to.url.href;

			document.startViewTransition(() => goto(href));
		} else {
			const navigationComplete = complete();

			document.startViewTransition(() => navigationComplete);
		}
	});

	const resolvers = new Set<() => void>();

	const complete = () =>
		new Promise<void>((resolve) => {
			resolvers.add(resolve);
		});

	// This used to subscribe inside the callback, but that resolved the promise too early
	const unsubscribe = navigating.subscribe((navigation) => {
		if (navigation !== null) return;

		resolvers.forEach((resolve) => {
			resolve();
		});

		resolvers.clear();
	});

	onDestroy(unsubscribe);
}
