<svelte:options namespace="svg" />

<script lang="ts">
	import {
		arrayMap,
		phi,
		polygonPath,
		radialPoint,
		radialPointString,
		viewBox
	} from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';
	import CarbonFiberPattern from '$lib/components/CarbonFiberPattern.svelte';
	import DrLogo from '$lib/components/DRLogo.svelte';
	import PathBuilder from '$lib/components/PathBuilder.svelte';

	const size = 2 ** 9;
	const bgsize = Math.sqrt(size ** 2 * 2);
	const strokeWidth = size / 2 ** 9;

	const r0 = (size / 2) * 0.9;
	const angles = arrayMap(16, (n) => (360 / 16) * n - 90);
	const oRadii = [
		r0,
		...arrayMap(9, (n) => Number((r0 - r0 * phi ** n).toFixed(1))).sort((a, b) => b - a)
	];
	const iRadii = oRadii.map((r) => oRadii[6] - (r0 - r) * 2);
	const radii = [...new Set([...oRadii, ...iRadii].sort((a, b) => b - a).filter((n) => n > 0))];

	const tesselatedOctagonPath4 =
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[0] : radii[6])).join('L') +
		'Z' +
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[3] : radii[7])).join('L') +
		'Z';

	const tesselatedOctagonPath3 =
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[3] : radii[7])).join('L') +
		'Z' +
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[4] : radii[8])).join('L') +
		'Z';

	const tesselatedOctagonPath2 =
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[4] : radii[8])).join('L') +
		'Z' +
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[5] : radii[9])).join('L') +
		'Z';

	const tesselatedOctagonPath =
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[5] : radii[9])).join('L') +
		'Z' +
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[6] : radii[11])).join('L') +
		'Z';
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<CarbonFiberPattern size={bgsize} scale={0.05} />
	</defs>
	<Background size={bgsize} transform={'rotate(45)'} fill="url(#CarbonFiberPattern)" />

	<!-- <path d={polygonPath(4, r0)} stroke="white" fill="none" />
	<path d={polygonPath(4, r0, { rotate: 45 })} stroke="white" fill="none" />

	{#each arrayMap(4, (n) => n) as i}
		<path d={polygonPath(4, radii[i + 3])} stroke="white" fill="none" />
		<path d={polygonPath(4, radii[i + 3], { rotate: 45 })} stroke="white" fill="none" />
	{/each} -->
	<!-- <circle r={oRadii[6]} stroke="white" fill="none" /> -->
	<!-- <path d={polygonPath(4, radii[6])} stroke="white" fill="hsl(0, 0%, 0%)" fill-opacity={0.75} />
	<path
		d={polygonPath(4, radii[6], { rotate: 45 })}
		stroke="white"
		fill="hsl(0, 0%, 0%)"
		fill-opacity={0.75}
	/> -->

	<path
		d={tesselatedOctagonPath}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(0, 0%, 90%)`}
		fill-rule="evenodd"
	/>
	<path
		d={tesselatedOctagonPath2}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(22.5, 0%, 60%)`}
		fill-rule="evenodd"
	/>
	<path
		d={tesselatedOctagonPath3}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(45, 0%,30%)`}
		fill-rule="evenodd"
	/>
	<path
		d={tesselatedOctagonPath4}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(60, 0%, 15%)`}
		fill-rule="evenodd"
	/>

	<!-- <PathBuilder {angles} {radii} /> -->
	<DrLogo
		size={size / 20}
		stroke={`hsl(0, 0%, 50%)`}
		strokeOpacity={0.5}
		transform={`translate(${size / 2 - size / 20} ${size / 2 - size / 20})`}
	/>
</svg>
