<script lang="ts">
	import { browser } from '$app/environment';
	import Background from '$lib/components/Background.svelte';
	import { arrayMap, phi, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import { onMount } from 'svelte';

	let size = browser ? Math.min(window.innerHeight, window.innerWidth) : 2 ** 8;

	let fill = 'hsl(220, 50%, 50%)';

	const angles = arrayMap(10, (n) => (360 / 10) * n);
	const radii = arrayMap(8, (n) => Math.round((size / 2) * phi ** n));

	const intersections = angles
		.map((a, ai) => [...radii.map((r, ri) => radialPoint(angles[ai], radii[ri]))])
		.flatMap((p) => p);

	let mouseCoords: Point | null = null;
	function handleMouseMove(event: MouseEvent) {
		console.log(event);
		mouseCoords = { x: -size / 2 + event.offsetX, y: -size / 2 + event.offsetY };
	}

	onMount(() => {
		function handleWindowResize() {
			window.location.reload();
		}
		window.addEventListener('resize', handleWindowResize);
		return () => window.removeEventListener('resize', handleWindowResize);
	});
</script>

<svg on:mousemove={handleMouseMove} viewBox={viewBox(size)}>
	<Background {size} {fill} />
	{#each radii as r, i}
		<circle {r} stroke="white" fill="none" />
	{/each}
	{#each angles as a, i}
		<path
			d={`M${radialPointString(a, radii[0])}L${radialPointString(a, radii[radii.length - 1])}`}
			stroke="white"
		/>
	{/each}
	{#each intersections as intersection, i}
		<text
			x={intersection.x}
			y={intersection.y}
			font-size="0.75em"
			fill="white"
			text-anchor="middle"
			alignment-baseline="middle">{i}</text
		>
	{/each}
	{#if mouseCoords}
		<circle cx={mouseCoords.x} cy={mouseCoords.y} r={10} stroke="white" fill="none" />
	{/if}
</svg>
