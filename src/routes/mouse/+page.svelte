<script lang="ts">
	import { browser } from '$app/environment';
	import Background from '$lib/components/Background.svelte';
	import PathBuilder from '$lib/components/PathBuilder.svelte';
	import { arrayMap, phi, radialPointString, viewBox } from '$lib/geometry';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	// let size = browser ? Math.min(window.innerHeight, window.innerWidth) : 2 ** 8;
	// let angleCount = 4;
	// const angles = arrayMap(angleCount, (n) => (360 / angleCount) * n - 90);
	// const radii = arrayMap(5, (n) => Math.round((size / 2) * 0.95 * phi ** (n * 0.5)));

	const size = 100;
	const r = size / 2;
	const angles = arrayMap(4, (n) => 90 * n - 90);
	const radii = arrayMap(5, (n) => Math.round(r * phi ** n));

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountZoomable = useZoomableViewbox(svg);
		return () => unmountZoomable();
	});
</script>

<svg bind:this={svg} viewBox={viewBox(size)}>
	<Background {size} fill="hsl(240, 50%, 20%)" />

	<PathBuilder {size} {angles} {radii} />

	<path
		d={[
			'M',
			radialPointString(angles[0], radii[0]),
			'L',
			radialPointString(angles[0], radii[1]),
			'A',
			radii[1],
			radii[1],
			'0 0 0',
			radialPointString(angles[3], radii[1]),
			'L',
			radialPointString(angles[3], radii[0]),
			'A',
			radii[0],
			radii[0],
			'0 0 0',
			radialPointString(angles[0], radii[0]),
			'Z'
		].join(' ')}
		stroke="yellow"
		fill="none"
	/>

	<path d="M0,-50L0,-31A31 31 0 0 0 -31,0L-50,0A50 50 0 0 1 0,-50Z" stroke="red" fill="none" />
</svg>
