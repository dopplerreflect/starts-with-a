<svelte:options namespace="svg" />

<script lang="ts">
	import { useSaveFile } from '$lib/save-svg';
	import { radialPoint, PHI } from '$lib/geometry';
	import { polygonScale } from 'geometric';
	import { onMount } from 'svelte';
	let size = 4096;
	let zoom = 1;
	let count = 144;
	let outerRadius = size / 2;
	let points = [...Array(count).keys()].map((k) => {
		let angle = k * (360 - 360 * (PHI - 1));
		let radius = (outerRadius / count) * k;
		return radialPoint(angle, radius);
	});
	let pointStrings = points.map((p) => `${p.x},${p.y}`);
	let cellPaths = [...Array(count).keys()].map((k, i) => {
		if (pointStrings[k + 21])
			return `M${i < 13 ? '0,0' : pointStrings[k]}L${pointStrings[k + 13]}L${
				pointStrings[k + 21]
			}L${pointStrings[k + 8]}Z`;
	});
	let scaledCells = [...Array(count).keys()].map((k, i) => {
		if (points[k + 21]) {
			let polygon = [
				i < 13 ? [0, 0] : [points[k].x, points[k].y],
				[points[k + 13].x, points[k + 13].y],
				[points[k + 21].x, points[k + 21].y],
				[points[k + 8].x, points[k + 8].y]
			];
			return polygonScale(polygon, PHI - 1);
		}
	});
	let scaledCellPaths = scaledCells
		.map(
			(c) =>
				c &&
				`M${c[0][0]},${c[0][1]}L${c[1][0]},${c[1][1]}L${c[2][0]},${c[2][1]}L${c[3][0]},${c[3][1]}Z`
		)
		.filter((e) => e !== undefined);
	let svg: SVGSVGElement;
	onMount(() => useSaveFile(svg));
</script>

<svg
	bind:this={svg}
	id="spiral-tile"
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`${-size / (zoom * 2)} ${-size / (zoom * 2)} ${size / zoom} ${size / zoom}`}
>
	<defs>
		<radialGradient id="rGradient">
			<stop offset="80%" stop-color="hsl(240, 100%, 50%)" />
			<stop offset="100%" stop-color="hsl(210, 100%, 50%)" />
		</radialGradient>
		<filter id="blur">
			<feOffset result="offOut" in="SourceGraphic" dx="0" dy={size / 360} />
			<feColorMatrix
				result="matrixOut"
				in="offOut"
				type="matrix"
				values="0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 1 0"
			/>
			<feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="20" />
			<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
		</filter>
	</defs>
	<path
		d={`M${-size / 2},${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="url(#rGradient)"
	/>
	<g id="figure" filter="url(#blur)">
		{#each cellPaths as path, i}
			<path
				d={path}
				fill={`hsla(${(i % 21) + 30}, 100%, 50%, 1)`}
				stroke={`hsla(${(i % 21) + 0}, 100%, 20%, 1)`}
				stroke-width={size / 360}
			/>
		{/each}
	</g>
	<g id="figure" filter="url(#blur)">
		{#each scaledCellPaths as path, i}
			<path
				d={path}
				fill={`hsla(${(i % 21) + 210}, 100%, 50%, 1)`}
				stroke={`hsla(${(i % 21) + 240}, 100%, 25%, 1)`}
				stroke-width={size / 720}
			/>
		{/each}
	</g>
	<!-- {#each points as p, i}
		<text
			x={p.x}
			y={p.y}
			alignment-baseline="middle"
			text-anchor="middle"
			fill="black"
			font-size={16 / zoom}>{i}</text
		>
	{/each} -->
</svg>
