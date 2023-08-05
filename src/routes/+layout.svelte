<script lang="ts">
	import '$lib/assets/texts.css';
	import '$lib/global.css';
	import { params, preparePageTransition } from '$lib/preparePageTransition';

	preparePageTransition();

	$: [hasFromID, hasToID] = [!!$params.from.id, !!$params.to.id];
</script>

<slot />

<div class:to-photo={!hasFromID && hasToID} class:to-thumbnails={hasFromID && !hasToID} />

<style>
	:global(.target-photo) {
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
