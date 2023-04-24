<svelte:options namespace="svg" />

<script>
	import { arrayMap, phi, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';

	const size = 2 ** 10;
	const r = (size / 8) * 3;
	const angles = arrayMap(10, (n) => 36 * n);
	const angles5 = arrayMap(5, (n) => 72 * n);
	const radii = arrayMap(3, (n) => r * phi ** n);

	const parse = pathFromDSL(angles, radii);
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<style>
			path,
			circle {
				stroke: white;
				fill: none;
			}
		</style>
	</defs>
	<circle {r} />
	{#each radii as r, i}
		<circle {r} />
	{/each}
	{#each angles as a, i}
		<path d={`M0 0L${radialPointString(a, r)}`} />
	{/each}
	<path d={parse('M0 0L4 0L8 0L 2 0L6 0Z')} />
	{#each angles5 as a}
		<circle
			r={radii[2]}
			cx={radialPoint(angles[0], radii[1]).x}
			cy={radialPoint(angles[0], radii[1]).y}
			transform={`rotate(${a})`}
		/>
	{/each}
</svg>
