<svelte:options namespace="svg" />

<script lang="ts">
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, phi, viewBox, radialPoint, SQRT3, polygonPath } from '$lib/geometry';
	const size = 2 ** 10;
	const angles = anglesArray(6);
	const ro = size / 4.1;
	const radii = [ro, ro * phi, ro * phi ** 2];
	const circles: Circle[] = angles
		.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) })))
		.flat();
</script>

<DopplerSvg id="stellated-icosahedron" {size}>
	{#each radii as r}
		<circle {r} />
	{/each}
	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<g transform={`rotate(-36)`}>
		<path d={polygonPath(6, ro)} />
		<path d={polygonPath(3, radii[1], { rotate: 180 })} />
	</g>
</DopplerSvg>

<style>
	circle,
	path {
		fill: none;
		stroke: white;
		stroke-width: 1;
	}
	circle {
		stroke: grey;
	}
</style>
