<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import HexTiles2 from '$lib/components/HexTiles2.svelte';
	import SaturationFilter from '$lib/components/SaturationFilter.svelte';
	import { phi, viewBox } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { onMount } from 'svelte';

	let animate = false;
	const size = 6610;
	const height = size;
	const width = size * phi;
	const r = size / 45;
	const gap = 0;

	let a = 21.75;

	let svg: SVGSVGElement;
	onMount(() => {
		let af: number;
		function step() {
			a = a > 179 ? 0 : a + 0.25;
			setTimeout(() => {
				af = window.requestAnimationFrame(step);
			}, 100);
		}
		if (animate) af = window.requestAnimationFrame(step);
		const unmountSaveFile = useSaveFile(svg);
		return () => {
			window.cancelAnimationFrame(af);
			unmountSaveFile();
		};
	});
</script>

<svg id="hex-moire" bind:this={svg} viewBox={viewBox(width, height)}>
	<defs>
		<mask id="circleMask">
			<circle r={(size / 2) * 0.95} fill="white" />
		</mask>
		<SaturationFilter values={'1'} />
	</defs>
	<Background {width} {height} fill={`hsl(240, 100%, 0%)`} />
	<g id="circle" filter="url(#SaturationFilter)">
		<g transform={`rotate(${a}) translate(0 ${0})`} filter="">
			<HexTiles2
				{size}
				{r}
				{gap}
				fill={`none`}
				stroke={`hsl(120, 50%, 100%)`}
				strokeWidth={size / 500}
			/>
		</g>
		<g transform={`rotate(${-a})`}>
			<HexTiles2
				{size}
				{r}
				{gap}
				fill={`none`}
				stroke={`hsl(270, 100%, 100%)`}
				strokeWidth={size / 500}
			/>
		</g>
		<HexTiles2
			{size}
			{r}
			{gap}
			fill={`none`}
			stroke={`hsl(240, 100%, 100%)`}
			strokeWidth={size / 250}
		/>
	</g>
</svg>
