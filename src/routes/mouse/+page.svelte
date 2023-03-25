<script lang="ts">
	import { browser } from '$app/environment';
	import Background from '$lib/components/Background.svelte';
	import PathBuilder from '$lib/components/PathBuilder.svelte';
	import { arrayMap, phi, radialPointString, viewBox } from '$lib/geometry';

	let size = browser ? Math.min(window.innerHeight, window.innerWidth) : 2 ** 8;

	const angles = arrayMap(5, (n) => (360 / 5) * n);
	const radii = arrayMap(3, (n) => Math.round((size / 2) * phi ** n));
</script>

<svg viewBox={viewBox(size)}>
	<Background {size} fill="hsl(240, 50%, 20%)" />

	<PathBuilder {size} {angles} {radii} />
</svg>
