<script lang="ts">
	import { preparePageTransition } from '$lib/preparePageTransition';

	preparePageTransition();
</script>

<ul>
	<li>
		<a href="/wedding/red/">red</a>
	</li>
	<li>
		<a href="/wedding/blue/">blue</a>
	</li>
</ul>

<slot />

<ul>
	<li>
		<a href="/wedding/red/">red</a>
	</li>
	<li>
		<a href="/wedding/blue/">blue</a>
	</li>
</ul>
