<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import { anglesArray, phi, polygonPath, radialPoint } from '$lib/geometry';
	const size = 2 ** 10;
	const r = size / 6;
	const angles = anglesArray(6);
	const radii = [r, r * phi, r * phi ** 2, r * phi ** 3];
	const circles: Circle[] = angles
		.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) })))
		.flat();
</script>

<DopplerSvg id="phi-cubes" {size}>
	<defs>
		<g id="group">
			{#each circles as c, i}
				<path
					d={polygonPath(6, c.r, { center: { x: c.x, y: c.y }, rotate: 0 })}
					fill={`oklch(1 0.37 ${90 + 180 * (i % 2)} / ${1 / (circles.length / 4)})`}
					stroke={`oklch(0 0.09 60 / 1)`}
				/>
			{/each}
		</g>
		<HexPattern id="hp1" size={r / 16} patternTransform="rotate(30)" stroke="oklch(0.5 0.18 90)" />
	</defs>
	<Background {size} fill="black" />
	<Background {size} fill="url(#hp1)" />
	{#each angles as a}
		<use
			href="#group"
			transform={`translate(${radialPoint(a, radii[0]).x}, ${radialPoint(a, radii[0]).y})`}
		/>
	{/each}
</DopplerSvg>
