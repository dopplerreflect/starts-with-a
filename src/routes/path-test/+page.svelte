<script lang="ts">
	import PathBuilder from '$lib/components/PathBuilder.svelte';
	import { arrayMap, phi, viewBox } from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';

	const size = 2 ** 6;
	const r = (size / 2) * 0.9;
	const angles = arrayMap(4, (n) => n * 90 - 90);
	const radii = arrayMap(5, (n) => r * phi ** n);

	const parse = pathFromDSL(angles, radii);
</script>

<svg viewBox={viewBox(size)}>
	<PathBuilder {size} {angles} {radii} />
	<path d={parse('M0 0A0 0 0 0 1 1 0L1 1A1 1 0 0 0 0 1Z')} stroke="white" />
</svg>
