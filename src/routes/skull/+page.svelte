<svelte:options namespace="svg" />

<script>
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, arrayMap, phi, radialPoint, radialPointString } from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';

	const size = 2 ** 10;

	const r = size / 3.75;
	const angles = anglesArray(60);
	// const radii = arrayMap(7, (n) => r * phi ** n);
	const radii = arrayMap(13, (n) => r * phi ** (n * 0.5));

	const parse = pathFromDSL(angles, radii);
</script>

<DopplerSvg viewBox={`${-size / 2} ${-size / 3} ${size} ${size}`} id="skull">
	<defs>
		<style>
			circle,
			path:not(.Background) {
				fill: none;
				stroke: black;
				stroke-width: 1;
			}
			.red {
				stroke: red;
			}
			#nose {
				fill: blue;
				fill-opacity: 0.5;
			}
		</style>
	</defs>
	<Background {size} fill="white" />
	<image href="/skull.jpg" x={-size / 1.57} y={-size / 2.05} width={size * 1.25} />

	<circle {r} />

	{#each angles as a, i}
		<path d={`M${radialPointString(a, radii[5])}L${radialPointString(a, r)}`} />
		<text
			x={radialPoint(a, r + size / 60).x}
			y={radialPoint(a, r + size / 60).y}
			alignment-baseline="middle"
			text-anchor="middle">{i}</text
		>
	{/each}

	{#each radii as r}
		<circle {r} />
	{/each}
	<path id="pentagram" d={parse('M0 0L24 0L48 0L12 0L36 0Z')} />
	<!-- <circle
		class="red"
		r={radii[11]}
		cx={radialPoint(angles[29], radii[1]).x}
		cy={radialPoint(angles[29], radii[1]).y}
	/> -->
	<!-- <path d={parse(`M30 1A11 11 0 0 0 28 1A4 4 0 0 0 28 3`)} class="red" /> -->
	<path
		id="nose"
		d={parse(
			`M30 1A11 11 0 0 0 28 1Q27 2 28 3S29 4 29 5A5 5 0 0 1 31 5Q31 4 32 3S33 2 32 1A 11 11 0 0 0 30 1Z`
		)}
	/>
</DopplerSvg>
