<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { params } from '$lib/preparePageTransition';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ texts, photos, images } = data);
	$: targetID = $params.from.id ?? $params.to.id;
</script>

<svelte:head>
	<meta property="og:image" content="{$page.url.origin}{images.hero.full.src}" />
</svelte:head>

<div class="hero-area">
	<div class="texts hero">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html texts['hero']}
	</div>

	<img
		id="img-hero"
		alt=""
		loading="lazy"
		decoding="async"
		{...images.hero.full}
		style:background-image="url({images.hero.placeholder.src})"
	/>
</div>

<div class="columns message-area">
	<div class="texts message">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html texts['message']}
	</div>
</div>

<div class="columns profile-area">
	<div class="texts profile-groom">
		<img
			id="img-groom"
			alt=""
			loading="lazy"
			decoding="async"
			{...images.groom.full}
			style:background-image="url({images.groom.placeholder.src})"
		/>

		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html texts['profile-groom']}
	</div>

	<div class="texts profile-bride">
		<img
			id="img-bride"
			alt=""
			loading="lazy"
			decoding="async"
			{...images.bride.full}
			style:background-image="url({images.bride.placeholder.src})"
		/>

		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html texts['profile-bride']}
	</div>
</div>

<div class="columns history-interview-area" style:background-image="url({images.bg2})">
	<div class="texts our-history">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html texts['our-history']}
	</div>

	<div class="texts interview">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html texts['interview']}
	</div>
</div>

<div class="texts our-photos">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html texts['our-photos']}
</div>

<div class="thumbnails-area">
	{#each photos as { id, thumbnail, placeholder }}
		<a href="{base}/{id}/">
			<img
				class="thumbnail"
				class:target-photo={id === targetID}
				alt=""
				loading="lazy"
				decoding="async"
				{...thumbnail}
				style:background-image="url({placeholder.src})"
			/>
		</a>
	{/each}
</div>

<style>
	.hero-area {
		width: 100%;
		height: 100vh;
		height: 100svh;
		max-height: min(235vw, 1500px);
		display: grid;
		place-items: center;
		position: relative;
	}
	.hero-area > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		background-size: cover;
		pointer-events: none;
		user-select: none;
		position: absolute;
		z-index: -100;
	}

	.columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
		gap: 3vw;
		padding-left: max(env(safe-area-inset-left), 16px, 2vw, (100% - 1600px) / 2);
		padding-right: max(env(safe-area-inset-right), 16px, 2vw, (100% - 1600px) / 2);
	}

	.history-interview-area {
		background-size: cover;
	}

	.thumbnails-area {
		display: grid;
		grid-template-columns: repeat(
			auto-fit,
			minmax(clamp(100px, -5px + 25%, min(220px + 3.5%, 350px)), 1fr)
		);
		gap: 1px;
	}

	.thumbnail {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		background-size: cover;
	}
</style>
