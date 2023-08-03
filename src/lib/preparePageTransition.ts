import { beforeNavigate, goto } from '$app/navigation';
import { navigating } from '$app/stores';
import { onDestroy } from 'svelte';
import { writable, type Readable } from 'svelte/store';

const _params = /* @__PURE__ */ writable<{
	from: Record<string, string>;
	to: Record<string, string>;
}>({
	from: {},
	to: {}
});

export const params: Readable<{
	from: Record<string, string>;
	to: Record<string, string>;
}> = _params;

export function preparePageTransition(): void {
	// before navigating, start a new transition
	beforeNavigate((navigation) => {
		_params.set({
			from: navigation.from?.params ?? {},
			to: navigation.to?.params ?? {}
		});

		if (!document.startViewTransition) return;

		if (navigation.type === 'goto') {
			// do nothing
		} else if (navigation.type === 'link' && navigation.to) {
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
