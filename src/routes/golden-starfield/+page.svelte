<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, arrayMap, pentagram, phi, radialPoint, viewBox } from '$lib/geometry';
	const size = 2 ** 10;
	const radii = arrayMap(10, (n) => (size * 0.6) * phi ** n);

	const pentagramPaths = anglesArray(10, 0)
		.map((a) =>
			[...Array(5).keys()].map((i) =>
				pentagram(radii[i + 2], { center: radialPoint(a, radii[i]), rotate: a + 18 })
			)
		)
		.flat();
</script>

<DopplerSvg id="golden-starfield" viewBox={viewBox(size)}>
	<Background {size} fill="black" />
	<g fill-rule="evenodd" stroke-width={5}>
		{#each pentagramPaths as path, i}
			<path d={path} style={`fill:oklch(0.85 0.37 ${0 + (i % 3) * 60});stroke:white;stroke-linejoin:bevel`} />
		{/each}
	</g>
</DopplerSvg>
