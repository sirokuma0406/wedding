<script lang="ts">
	import { browser } from '$app/environment';
	import { transitionTarget } from '$lib/transitionTarget';
	import type { PageData } from './$types';
	import './global.css';

	export let data: PageData;

	$: ({ texts, photos, thumbnails, images } = data);

	$: ({ navigationType, targetID } = $transitionTarget);

	$: if (browser) {
		document.documentElement.className = navigationType;
	}
</script>

<div class="hero">
	<h1>
		<div>2023.9.17 Sun.</div>
		<div>The Wedding of Kazuma Kayo</div>
	</h1>

	<img alt="" {...images.hero} />
</div>

<div class="columns profile">
	<div class="groom">
		<h1>Groom</h1>
		<img alt="" {...images.groom} />
		{@html texts['profile-groom']}
	</div>

	<div class="bride">
		<h1>Bride</h1>
		<img alt="" {...images.bride} />
		{@html texts['profile-bride']}
	</div>
</div>

<div class="columns history-interview" style:background-image="url({images.bg2})">
	<div>
		<h1>Our History</h1>
		{@html texts['our-history']}
	</div>

	<div>
		<h1>Interview</h1>
		{@html texts['interview']}
	</div>
</div>

<h1>Our Photos</h1>

{#each photos as { id, srcset, src, width, height }}
	{@const target = `photo-${id}` === targetID}
	{@const thumbnail = thumbnails.find((_) => _.id === id)}

	<img
		class="photo"
		class:target
		class:transition-target={target}
		loading="lazy"
		decoding="async"
		alt=""
		{id}
		{srcset}
		{src}
		{width}
		{height}
		style:background-image="url({thumbnail?.src})"
	/>
{/each}

<div class="backdrop" />

<div class="thumbnails">
	{#each thumbnails as { id, srcset, src, width, height }}
		{@const target = `thumbnail-${id}` === targetID}

		<a data-sveltekit-reload href="#{id}"
			><img
				class="thumbnail"
				class:target
				class:transition-target={target}
				alt=""
				{srcset}
				{src}
				{width}
				{height}
			/></a
		>
	{/each}
</div>

<style>
	h1 {
		text-align: center;
	}

	.hero {
		color: white;
		width: 100%;
		height: 100dvh;
		display: grid;
		place-items: center;
	}
	.hero > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		pointer-events: none;
		user-select: none;
		position: absolute;
		z-index: -100;
	}

	.columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
		gap: 3vw;
		padding-inline: max(2vw, (100% - 1600px) / 2);
	}

	.profile {
		text-align: center;
	}
	.profile .groom > img {
		clip-path: inset(0 round 43% 57% 56% 44% / 52% 53% 47% 47%);
	}
	.profile .bride > img {
		clip-path: inset(0 round 57% 43% 35% 65% / 51% 53% 47% 49%);
	}

	.history-interview {
		color: white;
		background-size: cover;
	}

	.thumbnails {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(clamp(159px, 30%, 296px), max-content));
		gap: 1px;
	}

	.thumbnail {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}

	.photo {
		max-height: 100%;
		position: fixed;
		z-index: 100;
		inset: 0;
		margin: auto;
	}
	.photo:not(.target) {
		display: none;
	}

	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 50;
		background-color: black;
	}
	.backdrop:not(.photo.target ~ .backdrop) {
		opacity: 0;
		visibility: hidden;
	}
</style>
