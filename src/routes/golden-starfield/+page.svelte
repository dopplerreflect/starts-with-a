<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import {
		anglesArray,
		arrayMap,
		pentagram,
		phi,
		radialPoint,
		radialPointString,
		viewBox
	} from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';
	import { useSaveFile } from '$lib/save-svg';
	import { onMount } from 'svelte';

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountSaveFile = useSaveFile(svg, { timestamp: true });
		return () => {
			unmountSaveFile();
		};
	});
	const size = 2 ** 10;
	const r = size / 3;
	const angles = arrayMap(10, (n) => 36 * n - 18);
	const angles10 = anglesArray(10, 0);
	const radii = arrayMap(6, (n) => r * phi ** n);

	const parse = pathFromDSL(angles, radii);
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<style>
			path,
			circle {
				stroke: black;
				stroke-width: 2;
			}
			path.f {
				fill: oklch(1 0.37 60 / 0.5);
			}
			.lotsapentagrams path {
				fill: oklch(1 0.37 60 / 1);
				/* fill-rule: evenodd; */
			}
		</style>
	</defs>
	<Background {size} fill="white" />
	<g class="lotsapentagrams">
		{#each angles10 as a}
			<path d={pentagram(radii[2], { center: radialPoint(a, radii[0]), rotate: a + 18 })} />
			<path d={pentagram(radii[3], { center: radialPoint(a, radii[1]), rotate: a + 18 })} />
			<path d={pentagram(radii[4], { center: radialPoint(a, radii[2]), rotate: a + 18 })} />
			<path d={pentagram(radii[5], { center: radialPoint(a, radii[3]), rotate: a + 18 })} />
			<path d={pentagram(radii[5] * phi, { center: radialPoint(a, radii[4]), rotate: a + 18 })} />
			<path
				d={pentagram(radii[5] * phi ** 2, { center: radialPoint(a, radii[5]), rotate: a + 18 })}
			/>
		{/each}
	</g>
	{#each anglesArray(20) as a, i}
		<path d={`M${radialPointString(a, radii[5])}L${radialPointString(a, size)}`} />
	{/each}
	<path class="f" d={parse('M0 0L4 0L8 0L 2 0L6 0Z')} />
</svg>
