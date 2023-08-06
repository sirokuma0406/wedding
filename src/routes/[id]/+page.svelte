<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ full, thumbnail } = data.photo);
</script>

<svelte:head>
	<meta property="og:image" content="{$page.url.origin}{thumbnail.src}" />

	<style>
		body:is(body):is(body) {
			background: black;
		}
	</style>
</svelte:head>

<img
	class="photo"
	class:target-photo={true}
	alt=""
	loading="lazy"
	decoding="async"
	{...full}
	style:background-image="url({thumbnail.src})"
/>

<style>
	.photo {
		height: auto;
		max-width: 100%;
		max-height: 100%;
		position: absolute;
		inset: 0;
		margin: auto;
	}
</style>
