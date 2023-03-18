<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import {
		anglesArray,
		arrayMap,
		radialPoint,
		starPoints,
		viewBox,
		phi,
		radialPointString
	} from '$lib/geometry';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	const size = 1024;
	const hue = 270;
	const angles = anglesArray(120);
	const radii = arrayMap(4, (n) => Math.round((size / 2) * phi ** n));
	const refLine: { x1: number; y1: number; x2: number; y2: number } = {
		x1: radialPoint(angles[10], radii[2]).x,
		y1: radialPoint(angles[10], radii[2]).y,
		x2: radialPoint(angles[22], radii[0]).x,
		y2: radialPoint(angles[22], radii[0]).y
	};
	const iLines = [...Array(11).keys()].map((k) => ({
		x1: radialPoint(angles[k * 2], radii[0]).x,
		y1: radialPoint(angles[k * 2], radii[0]).y,
		x2: radialPoint(angles[k * 2 + 12], radii[2]).x,
		y2: radialPoint(angles[k * 2 + 12], radii[2]).y
	}));
	const intersections = iLines.map((i) => {
		const { x1, y1, x2, y2 } = refLine;
		const { x1: x3, y1: y3, x2: x4, y2: y4 } = i;
		const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

		let x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator;

		let y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator;

		if (x === -0) x = 0;
		if (y === -0) y = 0;

		return { x, y };
	});
	console.log(intersections);
	const iRadii = [radii[0], ...intersections.map((i) => Math.sqrt(i.x ** 2 + i.y ** 2)), radii[2]];
	let svg: SVGSVGElement;
	onMount(() => useZoomableViewbox(svg));
</script>

<svg bind:this={svg} id="x" viewBox={viewBox(size)}>
	<defs>
		<mask id="mask1">
			<Background width={size} fill="white" />
			<circle r={radii[2]} fill="black" />
		</mask>
	</defs>
	<Background width={size} fill={`hsl(${hue}, 50%, 15%)`} />
	<g mask="url(#mask1)">
		{#each angles as a, i}
			<path
				d={`M${radialPointString(a, i % 2 === 0 ? radii[0] : iRadii[11])}L${radialPointString(
					a,
					radii[2]
				)}`}
				stroke={`hsla(${hue}, 50%, 50%, 0.5)`}
			/>
		{/each}
		{#each iRadii as r, i}
			<circle {r} stroke={`hsla(${hue}, 50%, 50%, 0.5)`} fill="none" />
		{/each}
		{#each anglesArray(12) as a, i}
			<polygon
				points={starPoints(radii[0], { rotate: 6 * i })}
				stroke=""
				fill={`hsla(${i % 2 === 0 ? hue : hue + 30}, 50%, 50%, ${1 / 6})`}
			/>
		{/each}
	</g>
</svg>
