<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import HexTiles2 from '$lib/components/HexTiles2.svelte';
	import { viewBox } from '$lib/geometry';
	import { onMount } from 'svelte';
	import HexThing from './HexThing.svelte';
	import { useSaveFile } from '$lib/save-svg';

	const size = 6600;

	const bgPath = '/printify/unisex-football-jersey-aop';

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountSaveFile = useSaveFile(svg);
		return () => {
			unmountSaveFile();
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
	</defs>
	<Background {size} fill="url(#rGradient2)" />
	<g transform={`translate(0 ${-size / 33})`}>
		<HexTiles2
			{size}
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
	<image
		x={-size / 2}
		y={-size / 2}
		width={size}
		height={size}
		href={`${bgPath}/front.png`}
		style="opacity: 0.25"
	/>
</svg>
