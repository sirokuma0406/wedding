<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ full, thumbnail } = data.photo);

	const close = () => {
		window.history.back();
	};
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

<button type="button" aria-label="写真を閉じる" class="close white" on:click={close}></button>

<style>
	.photo {
		height: auto;
		max-width: 100%;
		max-height: 100%;
		position: absolute;
		inset: 0;
		margin: auto;
	}

	.close {
		position: absolute;
		top: 8px;
		right: 8px;

		font-size: inherit;
		box-sizing: content-box;
		width: 1em;
		height: 1em;
		padding: 0.5em;
		background: white
			url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")
			center / 1em auto no-repeat;
		border: 0;
		border-radius: 0.25rem;
		opacity: 0.5;
	}
	.close:enabled {
		cursor: pointer;
	}
	.close:enabled:hover {
		opacity: 0.75;
	}
	.close.white {
		filter: invert(1) grayscale(100%) brightness(200%);
	}
</style>
