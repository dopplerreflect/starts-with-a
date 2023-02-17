<svelte:options namespace="svg" />

<script lang="ts">
	import { useSaveFile } from '$lib/save-svg';
	import { radialPoint, PHI } from '$lib/geometry';
	import { polygonScale } from 'geometric';
	import { onMount } from 'svelte';
	let size = 8092;
	let zoom = PHI;
	let count = 288;
	let outerRadius = size / 2;
	let points = [...Array(count).keys()].map((k) => {
		let angle = k * (360 - 360 * (PHI - 1));
		let radius = (outerRadius / count) * k;
		return radialPoint(angle, radius);
	});
	let polygons = [...Array(count).keys()]
		.map(
			(k) =>
				points[k + 21] && [
					k < 13 ? [0, 0] : [points[k].x, points[k].y],
					[points[k + 13].x, points[k + 13].y],
					[points[k + 21].x, points[k + 21].y],
					[points[k + 8].x, points[k + 8].y]
				]
		)
		.filter((e) => e !== undefined);
	let scaledPolygons = (scale: number) => polygons.map((p) => polygonScale(p, scale));
	let scaledPolygonPaths = (scale: number) =>
		scaledPolygons(scale).map(
			(c) =>
				`M${c[0][0]},${c[0][1]}L${c[1][0]},${c[1][1]}L${c[2][0]},${c[2][1]}L${c[3][0]},${c[3][1]}Z`
		);
	let svg: SVGSVGElement;
	onMount(() => useSaveFile(svg));
</script>

<svg
	bind:this={svg}
	id="spiral-tile"
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`${-size / (zoom * 2)} ${(-size / (zoom * 2)) * (PHI - 1)} ${size / zoom} ${
		(size / zoom) * (PHI - 1)
	}`}
>
	<defs>
		<radialGradient id="rGradient">
			<stop offset="0%" stop-color="hsl(240, 100%, 50%)" />
			<stop offset="100%" stop-color="hsl(270, 100%, 25%)" />
		</radialGradient>
		<filter id="blur">
			<feOffset result="offOut" in="SourceGraphic" dx="0" dy={size / 270} />
			<feColorMatrix
				result="matrixOut"
				in="offOut"
				type="matrix"
				values="0.25 0 0 0 0 0 0.25 0 0 0 0 0 0.25 0 0 0 0 0 1 0"
			/>
			<feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="10" />
			<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
		</filter>
	</defs>
	<path
		d={`M${-size / 2},${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="url(#rGradient)"
	/>
	<g id="level1" filter="url(#blur)">
		{#each scaledPolygonPaths(1) as path, i}
			<path
				d={path}
				fill={`hsla(240,100%,50%,0.1)`}
				stroke={`hsla(270, 100%, 50%, 0.5)`}
				stroke-width={size / 360}
				stroke-linejoin="round"
			/>
		{/each}
	</g>
	<g id="level2" filter="url(#blur)">
		{#each scaledPolygonPaths(PHI - 1) as path, i}
			<path
				d={path}
				fill={`hsla(${(i % 21) + 240}, 100%, 50%, 1)`}
				stroke={`hsla(${(i % 13) + 270}, 100%, 30%, 1)`}
				stroke-width={size / 360}
				stroke-linejoin="round"
			/>
		{/each}
	</g>
	<g id="level1" filter="url(#blur)">
		{#each scaledPolygonPaths((PHI - 1) ** 2) as path, i}
			<path
				d={path}
				fill={`hsla(${(i % 21) + 270}, 100%, 33%, 1)`}
				stroke={`hsla(${(i % 21) + 300}, 100%, 33%, 1)`}
				stroke-width={size / 720}
				stroke-linejoin="round"
			/>
		{/each}
	</g>
</svg>
