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
	// const squareLengths = [r * Phi, r, r * phi, r * phi ** 2];
	// const squares = squareLengths.map((l) => [
	// 	{ x: -l, y: l },
	// 	{ x: l, y: -l },
	// 	{ x: l, y: l },
	// 	{ x: -l, y: l }
	// ]);
	const s1: Point[] = [
		{ x: -r * Phi, y: -r * Phi },
		{ x: r * Phi, y: -r * Phi },
		{ x: r * Phi, y: r * Phi },
		{ x: -r * Phi, y: r * Phi }
	];
	const s2: Point[] = [
		{ x: -r, y: -r },
		{ x: r, y: -r },
		{ x: r, y: r },
		{ x: -r, y: r }
	];
	const s3: Point[] = [
		{ x: -r * phi, y: -r * phi },
		{ x: r * phi, y: -r * phi },
		{ x: r * phi, y: r * phi },
		{ x: -r * phi, y: r * phi }
	];
	const s4: Point[] = [
		{ x: -r * phi ** 2, y: -r * phi ** 2 },
		{ x: r * phi ** 2, y: -r * phi ** 2 },
		{ x: r * phi ** 2, y: r * phi ** 2 },
		{ x: -r * phi ** 2, y: r * phi ** 2 }
	];
	const yp: Point[] = [
		{ x: s1[0].x, y: s1[0].y },
		{ x: s1[1].x, y: s4[2].y },
		{ x: s1[3].x, y: s4[2].y },
		{ x: s1[1].x, y: s1[1].y },
		{ x: s4[3].x, y: s1[2].y },
		{ x: s4[3].x, y: s1[0].y },
		{ x: s1[2].x, y: s1[2].y },
		{ x: s1[3].x, y: s4[0].y },
		{ x: s1[1].x, y: s4[0].y },
		{ x: s1[3].x, y: s1[3].y },
		{ x: s4[2].x, y: s1[0].y },
		{ x: s4[2].x, y: s1[3].y }
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
				fill: oklch(1 0.37 75 / 0.5);
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
	</defs>
	<Background {size} fill="oklch(0.1 0.175 300)" />

	<line x1={-size / 2} x2={size / 2} />

	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<line x1={s1[0].x} y1={s1[0].y} x2={s1[2].x} y2={s1[2].y} />
	<line x1={s1[1].x} y1={s1[1].y} x2={s1[3].x} y2={s1[3].y} />

	<line x1={s4[0].x} y1={s1[0].y} x2={s4[0].x} y2={s1[3].y} />
	<line x1={s4[1].x} y1={s1[0].y} x2={s4[1].x} y2={s1[3].y} />

	<line x1={s1[0].x} y1={s4[0].y} x2={s1[1].x} y2={s4[0].y} />
	<line x1={s1[0].x} y1={s4[2].y} x2={s1[1].x} y2={s4[2].y} />

	<path class="s" d={`M${s1.map((p) => pointToString(p)).join(' ')}Z`} />
	<path class="s" d={`M${s2.map((p) => pointToString(p)).join(' ')}Z`} />
	<path class="s" d={`M${s3.map((p) => pointToString(p)).join(' ')}Z`} />
	<path class="s" d={`M${s4.map((p) => pointToString(p)).join(' ')}Z`} />

	<path class="y" d={`M${yp.map((p) => pointToString(p)).join(' ')}Z`} filter="url(#blur)" />
</DopplerSvg>
