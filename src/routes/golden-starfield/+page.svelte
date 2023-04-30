<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, arrayMap, pentagram, phi, radialPoint, viewBox } from '$lib/geometry';
	const size = 2 ** 13;
	const radii = arrayMap(12, (n) => (size / 3) * phi ** n);

	const pentagramPaths = anglesArray(10, 0)
		.map((a) =>
			[...Array(8).keys()].map((i) =>
				pentagram(radii[i + 2], { center: radialPoint(a, radii[i]), rotate: a + 18 })
			)
		)
		.flat();
</script>

<DopplerSvg id="golden-starfield" viewBox={viewBox(size)}>
	<Background {size} fill="white" />
	<g fill-rule="evenodd">
		{#each pentagramPaths as path, i}
			<path d={path} fill={`oklch(0.88 0.37 ${30 + (i % 9) * 10})`} />
		{/each}
	</g>
</DopplerSvg>
