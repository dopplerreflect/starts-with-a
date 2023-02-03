<svelte:options namespace="svg" />

<script lang="ts">
	import BorderedPath from '$lib/components/BorderedPath.svelte';
	import { PHI, polygonPath, SQRT3 } from '$lib/geometry';
	let size = 4096;
	let hex_radius = size / 20 / SQRT3;
	let hex_gap = hex_radius * (PHI - 1);
	let y_offsets: number[] = [];
	for (let y = -size / 2; y <= size / 2 + hex_radius; y += (3 / 2) * hex_radius + hex_gap) {
		y_offsets.push(y);
	}
	let x_offsets: number[] = [];
	for (let x = -size / 2; x <= size / 2 + hex_radius * SQRT3; x += hex_radius * SQRT3 + hex_gap) {
		x_offsets.push(x);
	}
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
	<path
		d={`M${-size / 2},${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill={`hsl(0, 100%, 10%)`}
		stroke="white"
	/>
	{#each y_offsets as y, row}
		{#each x_offsets as x}
			<BorderedPath
				d={polygonPath(6, hex_radius, {
					center: { x: row % 2 === 0 ? x : x + (hex_radius / 2) * SQRT3 + hex_gap / 2, y: y }
				})}
				innerColor={`hsl(${30}, 100%, 50%)`}
				outerColor={`hsl(${15}, 100%, 50%)`}
				strokeWidth={hex_gap / 2}
			/>
		{/each}
	{/each}
</svg>
