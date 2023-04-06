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
	<path
		d={parse('M0 0L0 2A2 2 0 0 0 3 2L3 0A0 0 0 0 1 0 0Z')}
		fill="none"
		stroke="white"
		stroke-width={2}
	/>
	<path d={parse('M0 0L1 0L1 1L0 1Z')} fill="none" stroke="green" />
	<path d={parse('M0 0Q0 1 1 0L1 0C1 4 2 4 2 0A0 0 0 0 1 3 0Z')} fill="none" stroke="red" />
	<!-- <PathBuilder {size} {angles} {radii} /> -->
</svg>
