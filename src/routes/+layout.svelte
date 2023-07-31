<script lang="ts">
	import { goto } from '$app/navigation';
	import { preparePageTransition } from '$lib/preparePageTransition';

	preparePageTransition();

	// beforeNavigate((navigation) => {
	// 	console.log(navigation);

	// 	if (navigation.type === 'popstate') {
	// 		navigation.cancel();
	// 	}
	// });

	const onclick = async (
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLAnchorElement;
		}
	) => {
		const href = e.currentTarget.href;
		if (href === location.href) return;

		await document.startViewTransition!(async () => {
			console.log(await goto(href));
			// await tick();
		}).finished;
	};
</script>

<ul>
	<!-- <li>
		<a data-sveltekit-reload href="/wedding/red/" on:click|preventDefault={onclick}>red</a>
	</li> -->
	<li>
		<a href="/wedding/red/">red</a>
	</li>
	<!-- <li>
		<a data-sveltekit-reload href="/wedding/blue/" on:click|preventDefault={onclick}>blue</a>
	</li> -->
	<li>
		<a href="/wedding/blue/">blue</a>
	</li>
</ul>

<!-- <svelte:window
	on:popstate|preventDefault|capture={(e) => {
		console.log(e);
	}}
/> -->

<slot />

<ul>
	<!-- <li>
		<a data-sveltekit-reload href="/wedding/red/" on:click|preventDefault={onclick}>red</a>
	</li> -->
	<li>
		<a href="/wedding/red/">red</a>
	</li>
	<!-- <li>
		<a data-sveltekit-reload href="/wedding/blue/" on:click|preventDefault={onclick}>blue</a>
	</li> -->
	<li>
		<a href="/wedding/blue/">blue</a>
	</li>
</ul>
