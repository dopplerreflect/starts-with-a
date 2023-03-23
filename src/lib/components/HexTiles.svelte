<svelte:options namespace="svg" />

<script lang="ts">
	import BorderedPath from '$lib/components/BorderedPath.svelte';
	import { phi, polygonPath, SQRT3 } from '$lib/geometry';
	export let size: number;
	export let innerColor: string;
	export let outerColor: string;
	export let count: number;
	let hex_radius = size / count / SQRT3;
	let hex_gap = hex_radius * phi;
	let y_offsets: number[] = [];
	for (let y = -size / 2; y <= size / 2 + hex_radius; y += 1.4 * hex_radius + hex_gap) {
		y_offsets.push(y);
	}
	let x_offsets: number[] = [];
	for (let x = -size / 2; x <= size / 2 + hex_radius * SQRT3; x += hex_radius * SQRT3 + hex_gap) {
		x_offsets.push(x);
	}
</script>

<g>
	{#each y_offsets as y, row}
		{#each x_offsets as x}
			<BorderedPath
				d={polygonPath(6, hex_radius, {
					center: { x: row % 2 === 0 ? x : x + (hex_radius / 2) * SQRT3 + hex_gap / 2, y: y }
				})}
				{innerColor}
				{outerColor}
				strokeWidth={hex_gap / 2}
			/>
		{/each}
	{/each}
</g>
