<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import { anglesArray, arrayMap, pentagram, phi, radialPoint, viewBox } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountSaveFile = useSaveFile(svg, { timestamp: true });
		const unmountZoom = useZoomableViewbox(svg);
		return () => {
			unmountSaveFile();
			unmountZoom();
		};
	});
	const size = 2 ** 10;
	const r = size / 3;
	const radii = arrayMap(12, (n) => r * phi ** n);

	const pentagramPaths = anglesArray(10, 0)
		.map((a) =>
			[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
				pentagram(radii[i + 2], { center: radialPoint(a, radii[i]), rotate: a + 18 })
			)
		)
		.flat();
</script>

<svg bind:this={svg} id="golden-starfield" viewBox={viewBox(size)}>
	<defs>
		<style>
			path,
			circle {
				stroke: black;
			}
			path.f {
				fill: oklch(0.5 0.37 240 / 0.5);
			}
			.lotsapentagrams path {
				/* fill: oklch(1 0.37 60 / 1); */
				/* fill: none; */
				fill-rule: evenodd;
			}
		</style>
	</defs>
	<Background {size} fill="white" />
	<g class="lotsapentagrams">
		{#each pentagramPaths as path, i}
			<path d={path} fill={`oklch(0.88 0.37 ${30 + (i % 9) * 10})`} />
		{/each}
	</g>
</svg>
