<svelte:options namespace="svg" />

<script lang="ts">
	import BorderedPath from '$lib/components/BorderedPath.svelte';
	import { PHI, anglesArray, radialPoint, polygonPath, starPath } from '$lib/geometry';
	let goldenAngle = 360 - 360 / PHI;
	let count = 360;
	let angles = [...Array(count).keys()].map((k) => k * goldenAngle);
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="-101 -101 202 202">
	<path d="m-101,-101H101V101H-101Z" fill="hsl(270, 100%, 10%)" />
	{#each angles as angle, i}
		<BorderedPath
			d={polygonPath((i % 6) + 3, 1 + 0.015 * i, {
				center: {
					x: radialPoint(angle, i / (count / 100)).x,
					y: radialPoint(angle, i / (count / 100)).y
				},
				rotate: angle
			})}
			outerColor={`hsl(0, 100%, 50%)`}
			innerColor={`hsl(60, 100%, 50%)`}
			strokeWidth={1}
		/>
	{/each}
</svg>
