<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import { arrayMap, circleIntersections, lineToPath, polygonPath, viewBox } from '$lib/geometry';

	const size = 2 ** 8,
		r = size / 12,
		circles: Circle[] = [
			{ r, x: 0, y: 0 },
			{ r: r * 2, x: r, y: 0 },
			{ r: r * 2, x: -r, y: 0 }
		],
		vesicaPiscis: Line = circleIntersections(circles[1], circles[2]);
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<style>
			circle,
			path:not(.Background) {
				fill: none;
				stroke: black;
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.95 0.15 270)" />
	{#each circles as c, i}
		<!-- <circle r={c.r} cx={c.x} cy={c.y} /> -->
	{/each}
	<!-- <path d={lineToPath(vesicaPiscis)} /> -->
	{#each arrayMap(5, (n) => n + 1) as m, i}
		<path d={polygonPath(4, r * Math.sqrt(2) ** m, { rotate: (i * 45) % 90 })} />
		<circle r={r * Math.sqrt(2) ** m} />
	{/each}
</svg>
