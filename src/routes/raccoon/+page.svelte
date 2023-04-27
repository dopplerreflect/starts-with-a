<script lang="ts">
	import { Phi, phi, radialPoint, radialPointString, starPath } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';
	import RaccoonFace from './raccoonFace.svelte';
	const size = 8092;
	const count = 360;
	const guide = {
		angles: [...Array(36).keys()].map((k) => 10 * k),
		radii: [...Array(5).keys()].map((k) => Number(((size / 2) * phi ** k).toFixed(2)))
	};
	const angles = [...Array(count).keys()].map((k) => k * (360 * phi));
	const hues = { start: 0, end: 180 };
	function hue(i: number) {
		return Math.floor(hues.start - Math.abs(((hues.start - hues.end) / count) * i));
		// return (i % 8) * ((hues.end - hues.start) / 8) + hues.start;
	}
	let svg: SVGSVGElement;
	onMount(() => {
		const unmountSave = useSaveFile(svg);
		const unmountZoom = useZoomableViewbox(svg);
		return () => {
			unmountSave();
			unmountZoom();
		};
	});
</script>

<svg
	bind:this={svg}
	id="raccoonFace"
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
>
	<!-- <path
		d={`M${-size / 2},${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="hsl(0, 0%, 100%)"
	/> -->
	<image href="/raccoon.jpg" x={-size / 2} y={-size / 2} width={size} height={size} />
	<g id="guide">
		{#each guide.angles as a}
			<path d={`M0 0L${radialPointString(a, guide.radii[0])}`} stroke="white" stroke-width="10" />
		{/each}
		{#each guide.radii as r}
			<circle {r} stroke="white" stroke-width="10" fill="none" />
		{/each}
		<path d={starPath(guide.radii[1])} stroke="white" stroke-width="20" fill="none" />
	</g>
	{#each angles as a, i}
		<RaccoonFace
			size={i < 15 ? size / 80.92 : size / 80.92 + i * (size / Phi ** 17.3)}
			rotate={Math.round(a + 90)}
			center={radialPoint(a, (size / 1.4 / count) * i)}
			hue={hue(i)}
		/>
	{/each}
	<g style="opacity: 0.5">
		<RaccoonFace {size} rotate={0} center={{ x: 0, y: 0 }} hue={45} saturation={15} />
	</g>
	<image href="/DR-Logo.svg" width={size / 20} x={size / 2 - size / 20} y={size / 2 - size / 20} />
</svg>
