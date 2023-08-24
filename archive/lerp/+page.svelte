<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import PathBuilder from '$lib/components/PathBuilder.svelte';
	import { arrayMap, viewBox } from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';

	const size = 2 ** 8;
	const angles = arrayMap(12, (n) => (360 / 12) * n - 90);
	const r = (size / 2) * 0.85;
	const radii = [r, 0, r / 2.3, r / 4];

	const parse = pathFromDSL(angles, radii);
</script>

<svg viewBox={viewBox(size)}>
	<Background {size} fill={`hsl(0, 25%, 25%)`} />
	{#each radii as r}
		<!-- <circle {r} stroke={`hsl(0, 25%, 100%)`} fill="none" /> -->
	{/each}
	{#each angles as a, i}
		{#if i % 2 === 0}
			<!-- <path d={parse(`M${i} 0L0 1`)} stroke="hsl(0, 100%, 100%)" /> -->
		{/if}
	{/each}
	<path
		d={parse('M0 0Q0 1 2 0Q0 1 4 0Q0 1 6 0Q0 1 8 0Q0 1 10 0Q0 1 0 0Z')}
		stroke={`hsl(0, 100%, 50%)`}
		fill="none"
	/>
	<path d={parse('M0 0Q0 1 4 0Q0 1 8 0Q0 1 0 0Z')} stroke={`hsl(60, 100%, 50%)`} fill="none" />
	<path d={parse('M6 0Q0 1 10 0Q0 1 2 0Q0 1 6 0Z')} stroke={`hsl(60, 100%, 50%)`} fill="none" />
	<path d={parse('M6 0Q2 0 10 0Q6 0 2 0Q10 0 6 0Z')} stroke={`hsl(45, 100%, 50%)`} fill="none" />
	<path d={parse('M0 0Q8 0 4 0Q0 0 8 0Q4 0 0 0Z')} stroke={`hsl(45, 100%, 50%)`} fill="none" />
	<!-- <path d={parse('M0 0L4 0L8 0Z')} stroke={`hsl(0, 100%, 100%)`} fill="none" /> -->
	<!-- <path d={parse('M2 0L6 0L10 0Z')} stroke={`hsl(0, 100%, 100%)`} fill="none" /> -->
</svg>
