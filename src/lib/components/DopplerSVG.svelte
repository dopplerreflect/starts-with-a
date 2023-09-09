<svelte:options namespace="svg" />

<script lang="ts">
	import { viewBox as vb } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	export let viewBox: string | undefined = '';
	export let id: string;

	export let size: number = 2 ** 10;
	export let zoom: number = 0;
	export let xPan: number = 0;
	export let yPan: number = 0;

	let svg: SVGSVGElement;

	onMount(() => {
		const unmountSaveFile = useSaveFile(svg, { timestamp: true });
		const unmountZoom = useZoomableViewbox(svg, zoom, xPan, yPan);
		return () => {
			unmountSaveFile();
			unmountZoom();
		};
	});
</script>

<svg bind:this={svg} {id} viewBox={viewBox ? viewBox : vb(size)}>
	<slot />
</svg>
