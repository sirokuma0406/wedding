<script lang="ts">
	import '$lib/assets/texts.css';
	import '$lib/global.css';
	import { transitionTarget } from '$lib/transitionTarget';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ texts, photos, images } = data);

	$: ({ navigationType, targetID } = $transitionTarget);
</script>

<div class={navigationType} />

{#each photos as { id, full, thumbnail }}
	{@const target = `photo-${id}` === targetID}

	<img
		class="photo"
		class:target
		class:transition-target={target}
		alt=""
		loading="lazy"
		decoding="async"
		{id}
		{...full}
		style:background-image="url({thumbnail.src})"
	/>
{/each}

<div class="hero-area">
	<div class="texts hero">
		{@html texts['hero']}
	</div>

	<img
		alt=""
		loading="lazy"
		decoding="async"
		{...images.hero.full}
		style:background-image="url({images.hero.placeholder.src})"
	/>
</div>

<div class="texts message">
	{@html texts['message']}
</div>

<div class="columns profile-area">
	<div class="texts profile-groom">
		<img
			alt=""
			loading="lazy"
			decoding="async"
			{...images.groom.full}
			style:background-image="url({images.groom.placeholder.src})"
		/>

		{@html texts['profile-groom']}
	</div>

	<div class="texts profile-bride">
		<img
			alt=""
			loading="lazy"
			decoding="async"
			{...images.bride.full}
			style:background-image="url({images.bride.placeholder.src})"
		/>

		{@html texts['profile-bride']}
	</div>
</div>

<div class="columns history-interview-area" style:background-image="url({images.bg2})">
	<div class="texts our-history">
		{@html texts['our-history']}
	</div>

	<div class="texts interview">
		{@html texts['interview']}
	</div>
</div>

<div class="texts our-photos">
	{@html texts['our-photos']}
</div>

<div class="thumbnails-area">
	{#each photos as { id, thumbnail, placeholder }}
		{@const target = `thumbnail-${id}` === targetID}

		<a data-sveltekit-reload href="#{id}">
			<!-- loading="lazy" にするとレイアウトシフトが起きてしまうので eager -->
			<img
				class="thumbnail"
				class:target
				class:transition-target={target}
				alt=""
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
		display: grid;
		place-items: center;
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
		padding-left: max(max(env(safe-area-inset-left), 2vw), (100% - 1600px) / 2);
		padding-right: max(max(env(safe-area-inset-right), 2vw), (100% - 1600px) / 2);
	}

	.history-interview-area {
		background-size: cover;
	}

	.thumbnails-area {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(clamp(159px, 30%, 296px), max-content));
		gap: 1px;
	}

	.thumbnail {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		background-size: cover;
	}

	.photo {
		height: auto;
		max-width: 100%;
		max-height: 100%;
		position: fixed;
		z-index: 100;
		inset: 0;
		margin: auto;
	}
	.photo:not(.target) {
		display: none;
	}

	.photo.target ~ * {
		opacity: 0;
	}

	:global(body):has(.photo.target) {
		background: black;

		/* Disable scroll */
		/* https://dev.classmethod.jp/articles/dialog-element-and-modal-pseudo-class/ */
		overflow: hidden;
	}

	.transition-target {
		view-transition-name: target-photo;
	}

	:global(html):has(:is(.to-photo, .to-thumbnails))::view-transition-old(target-photo),
	:global(html):has(:is(.to-photo, .to-thumbnails))::view-transition-new(target-photo) {
		/* Use normal blending, so the new view sits on top and obscures the old view */
		mix-blend-mode: normal;
		/* Make the height the same as the group, meaning the view size might not match its aspect-ratio. */
		height: 100%;
		/* Clip any overflow of the view */
		overflow: clip;
	}

	/* The old view is the thumbnail */
	:global(html):has(.to-photo)::view-transition-old(target-photo),
	:global(html):has(.to-thumbnails)::view-transition-new(target-photo) {
		/* Maintain the aspect ratio of the view, by shrinking it to fit within the bounds of the element */
		object-fit: contain;
	}

	/* The new view is the full image */
	:global(html):has(.to-photo)::view-transition-new(target-photo),
	:global(html):has(.to-thumbnails)::view-transition-old(target-photo) {
		/* Maintain the aspect ratio of the view, by growing it to cover the bounds of the element */
		object-fit: cover;
		/* Prevent the default animation, so both views remain opacity:1 throughout the transition */
		animation: none;
	}
</style>
