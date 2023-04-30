<svelte:options namespace="svg" />

<script lang="ts">
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	export let viewBox: string;
	export let id: string;

	let svg: SVGSVGElement;

	onMount(() => {
		const unmountSaveFile = useSaveFile(svg, { timestamp: true });
		const unmountZoom = useZoomableViewbox(svg);
		return () => {
			unmountSaveFile();
			unmountZoom();
		};
	});
</script>

<svg bind:this={svg} {viewBox} {id}>
	<slot />
</svg>
