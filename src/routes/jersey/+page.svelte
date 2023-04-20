<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import HexTiles2 from '$lib/components/HexTiles2.svelte';
	import { Phi, phylotaxicPoints, polygonPath, viewBox } from '$lib/geometry';
	import { onMount } from 'svelte';
	import HexThing from './HexThing.svelte';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';

	const size = 6600;

	const bgPath = '/printify/unisex-football-jersey-aop';

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountSaveFile = useSaveFile(svg);
		const unmountZoomable = useZoomableViewbox(svg);
		return () => {
			unmountSaveFile();
			unmountZoomable();
		};
	});
</script>

<svg id="unisex-football-jersey" viewBox={viewBox(size)} bind:this={svg}>
	<defs>
		<radialGradient id="rGradient">
			<stop offset="0%" stop-color="hsl(45, 100%, 50%)" />
			<stop offset="100%" stop-color="hsl(0, 100%, 30%)" />
		</radialGradient>
		<radialGradient id="rGradient2">
			<stop offset="0%" stop-color="hsl(0, 100%, 30%)" />
			<stop offset="100%" stop-color="hsl(45, 100%, 50%)" />
		</radialGradient>
		<mask id="circleFade">
			<radialGradient id="fadeGradient">
				<stop offset="80%" stop-color="white" />
				<stop offset="100%" stop-color="black" />
			</radialGradient>
			<circle r={(size / 4) * 1.07} fill="url(#fadeGradient)" />
		</mask>
	</defs>
	<Background {size} fill="url(#rGradient)" />
	<g transform={`translate(0 ${size / 22})`}>
		{#each phylotaxicPoints(4096, size / 1.8) as p, i}
			<!-- <circle cx={p.x} cy={p.y} r={i / 64} fill={`oklch(1 0.37 ${30 + 1.5 * (i % 34)})`} /> -->
			<path
				d={polygonPath(6, i / 64, { center: p })}
				fill={`oklch(1 0.37 ${30 + 1.5 * (i % 34)})`}
				stroke="black"
				stroke-width="5"
			/>
		{/each}
	</g>
	<g transform={`translate(0 ${size / 22})`} mask="url(#circleFade)">
		<circle r={(size / 4) * 1.07} fill="url(#rGradient2)" />
		<HexTiles2
			circular={true}
			size={size * 1.1}
			fill="url(#rGradient)"
			stroke={'hsl(45, 50%, 50%)'}
			strokeWidth={20}
			r={size / 75}
		/>
	</g>
	<!-- <g transform={`translate(${-size * 0.125} ${-size / 3.005}) scale(0.25)`}>
		<HexThing {size} />
	</g>
	<g transform={`translate(${-size * 0.125} ${size / 13.5}) scale(0.25)`}>
		<HexThing {size} />
	</g> -->
	<g transform={`translate(${-size * 0.23} ${-size / 5.45}) scale(0.46)`}>
		<HexThing {size} />
	</g>
	<!-- <image
		x={-size / 2}
		y={-size / 2}
		width={size}
		height={size}
		href={`${bgPath}/front.png`}
		style="opacity: 0.25"
	/> -->
</svg>
