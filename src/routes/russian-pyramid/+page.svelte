<svelte:options namespace="svg" />

<script lang="ts">
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { Phi, anglesArray, radialPoint, viewBox } from '$lib/geometry';

	const size = Phi * 1000;
	const r = 1000;
	const r1 = Math.sqrt((r * 1.5) ** 2 + ((r * Math.sqrt(3)) / 2) ** 2);
	const l0: Line = [
		{ x: -size, y: -size },
		{ x: size, y: size }
	];
	const l1: Line = [
		{ x: -size, y: size },
		{ x: size, y: -size }
	];
	const circles: Circle[] = [
		{ r, x: 0, y: 0 },
		...anglesArray(6).map((a) => ({ r, ...radialPoint(a, r) })),
		{ r: r1, x: 0, y: -r },
		{ r: r1, x: 0, y: r },
		{ r, x: r, y: 0 },
		{ r, x: -r, y: 0 }
	];
</script>

<DopplerSvg id="russian-pyramid" viewBox={viewBox(size * 3)}>
	<defs>
		<style>
			path:not(.Background),
			circle,
			line {
				stroke: white;
				stroke-width: 3;
				fill: none;
			}
		</style>
	</defs>
	{#each circles as c}
		<circle r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<line x1={l0[0].x} y1={l0[0].y} x2={l0[1].x} y2={l0[1].y} />
	<line x1={l1[0].x} y1={l1[0].y} x2={l1[1].x} y2={l1[1].y} />
</DopplerSvg>
