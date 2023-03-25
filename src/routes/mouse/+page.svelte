<script lang="ts">
	import { browser } from '$app/environment';
	import Background from '$lib/components/Background.svelte';
	import PathBuilder from '$lib/components/PathBuilder.svelte';
	import { arrayMap, phi, radialPointString, viewBox } from '$lib/geometry';

	let size = browser ? Math.min(window.innerHeight, window.innerWidth) : 2 ** 8;
	let rotate: number | null = -90;
	const angles = arrayMap(15, (n) => (360 / 15) * n + (rotate ? rotate : 0));
	const radii = arrayMap(5, (n) => Math.round((size / 2) * phi ** (n * 0.5)));
</script>

<svg viewBox={viewBox(size)}>
	<Background {size} fill="hsl(240, 50%, 20%)" />

	<PathBuilder {size} {angles} {radii} {rotate} />
</svg>
