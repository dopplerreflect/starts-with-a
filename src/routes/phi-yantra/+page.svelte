<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { Phi, SQRT3, anglesArray, phi, pointToString, radialPoint, viewBox } from '$lib/geometry';

	const size = 2 ** 10;
	const r = size / Math.sqrt(3) / 2;
	const circles: Circle[] = [
		{ r, x: 0, y: 0 },
		{ r, x: -r, y: 0 },
		{ r, x: r, y: 0 },
		{ r: r * SQRT3, x: -r, y: 0 },
		{ r: r * SQRT3, x: r, y: 0 },
		{ r: r * Math.sqrt(2), x: 0, y: 0 }
	];
	const squareLengths = [r * Phi, r, r * phi, r * phi ** 2];
	const squares = squareLengths.map((l) => [
		{ x: -l, y: -l },
		{ x: l, y: -l },
		{ x: l, y: l },
		{ x: -l, y: l }
	]);
	const yp: Point[] = [
		{ x: squares[0][0].x, y: squares[0][0].y },
		{ x: squares[0][1].x, y: squares[3][2].y },
		{ x: squares[0][3].x, y: squares[3][2].y },
		{ x: squares[0][1].x, y: squares[0][1].y },
		{ x: squares[3][3].x, y: squares[0][2].y },
		{ x: squares[3][3].x, y: squares[0][0].y },
		{ x: squares[0][2].x, y: squares[0][2].y },
		{ x: squares[0][3].x, y: squares[3][0].y },
		{ x: squares[0][1].x, y: squares[3][0].y },
		{ x: squares[0][3].x, y: squares[0][3].y },
		{ x: squares[3][2].x, y: squares[0][0].y },
		{ x: squares[3][2].x, y: squares[0][3].y }
	];
</script>

<DopplerSvg id="phi-yantra" viewBox={viewBox(size)}>
	<defs>
		<style>
			path:not(.Background),
			circle,
			line {
				fill: none;
				stroke: grey;
			}
			path.s {
				stroke: white;
			}
			path.y {
				stroke-width: 2;
				stroke-linejoin: bevel;
				stroke: oklch(1 0.37 90 / 1);
				fill: url(#rGradient);
				fill-rule: evenodd;
			}
		</style>
		<filter id="blur">
			<feMorphology in="SourceGraphic" operator="dilate" radius="1" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="10" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<radialGradient id="rGradient">
			<stop offset="0%" stop-color="oklch(1 0.37 90 / 0.5)" />
			<stop offset="100%" stop-color="oklch(0.5 0.37 90 / 0.5)" />
		</radialGradient>
	</defs>
	<Background {size} fill="oklch(0.1 0.175 300)" />
	<line x1={-size / 2} x2={size / 2} />
	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<line x1={squares[0][0].x} y1={squares[0][0].y} x2={squares[0][2].x} y2={squares[0][2].y} />
	<line x1={squares[0][1].x} y1={squares[0][1].y} x2={squares[0][3].x} y2={squares[0][3].y} />
	<line x1={squares[3][0].x} y1={squares[0][0].y} x2={squares[3][0].x} y2={squares[0][3].y} />
	<line x1={squares[3][1].x} y1={squares[0][0].y} x2={squares[3][1].x} y2={squares[0][3].y} />
	<line x1={squares[0][0].x} y1={squares[3][0].y} x2={squares[0][1].x} y2={squares[3][0].y} />
	<line x1={squares[0][0].x} y1={squares[3][2].y} x2={squares[0][1].x} y2={squares[3][2].y} />
	<path class="s" d={`M${squares[0].map((p) => pointToString(p)).join(' ')}Z`} />
	<path class="s" d={`M${squares[1].map((p) => pointToString(p)).join(' ')}Z`} />
	<path class="s" d={`M${squares[2].map((p) => pointToString(p)).join(' ')}Z`} />
	<path class="s" d={`M${squares[3].map((p) => pointToString(p)).join(' ')}Z`} />
	<path class="y" d={`M${yp.map((p) => pointToString(p)).join(' ')}Z`} filter="url(#blur)" />
</DopplerSvg>