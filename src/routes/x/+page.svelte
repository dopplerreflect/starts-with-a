<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	import Background from '$lib/components/Background.svelte';
	import {
		anglesArray,
		arrayMap,
		radialPoint,
		starPoints,
		viewBox,
		phi,
		radialPointString,
		intersection,
		phylotaxicPoints
	} from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';
	import SourceCode from '$lib/components/SourceCode.svelte';

	const size = 1920;
	const strokeWidth = size / 1024;
	const hue = 0;
	const angles = anglesArray(120);
	const radii = arrayMap(3, (n) => Math.round((size / 2) * phi ** n));
	const { source } = data;
	const referenceLine: Line = [
		radialPoint(angles[10], radii[2]),
		radialPoint(angles[22], radii[0])
	];
	const intersectingLines: Line[] = [...Array(11).keys()].map((k) => [
		radialPoint(angles[k * 2], radii[0]),
		radialPoint(angles[k * 2 + 12], radii[2])
	]);
	const intersections = intersectingLines.map((intersectingLine) =>
		intersection(intersectingLine, referenceLine)
	);
	const iRadii = [
		radii[2],
		...intersections.map((intersection) => Math.sqrt(intersection.x ** 2 + intersection.y ** 2)),
		radii[0]
	].reverse();
	let svg: SVGSVGElement;
	onMount(() => {
		let unmountViewbox = useZoomableViewbox(svg);
		let unmountSaveFile = useSaveFile(svg);
		return () => {
			unmountViewbox();
			unmountSaveFile();
		};
	});
</script>

<svg bind:this={svg} id="x" viewBox={viewBox(size)}>
	<defs>
		<radialGradient id="gradient1">
			<stop offset="0%" stop-color="black" />
			<stop offset="100%" stop-color="white" />
		</radialGradient>
		<radialGradient id="gradient2">
			<stop offset="0%" stop-color="white" />
			<stop offset="100%" stop-color="black" />
		</radialGradient>

		<mask id="mask1">
			<Background width={size} fill="white" />
			<circle r={radii[2]} fill="url(#gradient1)" />
		</mask>
		<mask id="mask2">
			<circle r={radii[0]} fill="url(#gradient2)" />
		</mask>
	</defs>
	<Background width={size} fill={`hsl(${hue - 120}, 100%, 25%)`} />
	<g mask="url(#mask1)" transform="rotate(6)">
		{#each angles as a, i}
			<path
				d={`M${radialPointString(a, i % 2 === 0 ? radii[0] : iRadii[1])}L${radialPointString(
					a,
					radii[2]
				)}`}
				stroke={`hsla(${hue}, 50%, 50%, 0.5)`}
				stroke-width={strokeWidth}
			/>
		{/each}
		{#each iRadii as r, i}
			<circle {r} stroke={`hsla(${hue}, 50%, 50%, 0.5)`} fill="none" stroke-width={strokeWidth} />
		{/each}
		{#each anglesArray(12) as a, i}
			<polygon
				points={starPoints(radii[0], { rotate: 6 * i })}
				fill={`hsla(${i % 2 === 0 ? hue : hue + 30}, 100%, ${i % 2 === 0 ? 50 : 50}%, ${1 / 6})`}
				stroke={`hsla(${i % 2 === 0 ? hue : hue + 30}, 100%, ${i % 2 === 0 ? 50 : 50}%, ${1 / 3})`}
				stroke-width={strokeWidth}
			/>
		{/each}
	</g>
	<SourceCode {source} {size} fill="hsl(240, 100%, 20%, 0.5)" />
	<g mask="url(#mask2)">
		{#each phylotaxicPoints(610, radii[0]) as p, i}
			<circle
				r={((radii[0] / 610) * i) / 21 + 2 * strokeWidth}
				cx={p.x}
				cy={p.y}
				fill={`hsla(${(i % 13) * (30 / 13) + hue + 60}, 100%, 50%, 1)`}
				stroke={`hsla(${(i % 13) * (30 / 13) + hue + 60}, 50%, 25%, 1)`}
				stroke-width={strokeWidth}
			/>
		{/each}
	</g>
</svg>
