<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ id, full, thumbnail } = data.pickup!);
</script>

<svelte:head>
	<style>
		body {
			background: black;
		}
	</style>
</svelte:head>

<img
	class="photo"
	alt=""
	loading="lazy"
	decoding="async"
	{id}
	{...full}
	style:background-image="url({thumbnail.src})"
/>

<style>
	.transition-target {
		view-transition-name: target-photo;
	}

	.photo {
		height: auto;
		max-width: 100%;
		max-height: 100%;
		position: absolute;
		inset: 0;
		margin: auto;
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
