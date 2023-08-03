<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ full, thumbnail } = data.photo);
</script>

<img
	class="photo"
	class:target-photo={true}
	alt=""
	loading="lazy"
	decoding="async"
	{...full}
	style:background-image="url({thumbnail.src})"
/>

<svelte:head>
	<style>
		body:is(body):is(body) {
			background: black;
		}
	</style>
</svelte:head>

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
