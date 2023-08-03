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
	const transitioning = {
		current: new AbortController()
	};

	// before navigating, start a new transition
	beforeNavigate(async (navigation) => {
		_params.set({
			from: navigation.from?.params ?? {},
			to: navigation.to?.params ?? {}
		});

		if (!document.startViewTransition) return;

		if (navigation.type === 'goto') return;

		let callback: () => PromiseLike<void>;

		if (navigation.type === 'link' && navigation.to) {
			navigation.cancel();

			const href = navigation.to.url.href;

			callback = () => goto(href);
		} else {
			const navigationComplete = complete();

			callback = () => navigationComplete;
		}

		transitioning.current.abort();

		const changing = new AbortController();
		const aborted = () => changing.signal.aborted;

		transitioning.current = changing;

		if (aborted()) return;

		const transition = document.startViewTransition(callback);

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
