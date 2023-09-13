<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import { SQRT3, polygonPath } from '$lib/geometry';

	const size = 2 ** 10;
	const ro = size / 89;
	const radii = [3, 5, 8, 13, 21].map((i) => i * ro * 2);
</script>

<DopplerSvg id="golden-hex" {size}>
	<defs>
		<mask id="mask">
			<path
				d={`M${-size / 2} ${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
				fill="oklch(1 0 0 / 0.5)"
			/>
			{#each radii as r, i}
				<path
					d={polygonPath(6, r, { rotate: 30, center: { x: 0, y: 0 } })}
					stroke-width={ro * SQRT3 + 1}
					fill="none"
					stroke="white"
				/>
			{/each}
		</mask>
		<HexPattern size={ro} id="hp" stroke="oklch(1 0.37 60)" />
	</defs>
	<g mask="url(#mask)">
		<Background {size} fill="url(#hp)" />
	</g>
	{#each radii as r, i}
		<path
			d={polygonPath(6, r + (ro * SQRT3) / 2 + 1.5, { rotate: 30, center: { x: 0, y: 0 } })}
			fill="none"
			stroke="oklch(1 0.37 90)"
			stroke-width={2}
		/>
		<path
			d={polygonPath(6, r - (ro * SQRT3) / 2 - 1.5, { rotate: 30, center: { x: 0, y: 0 } })}
			fill="none"
			stroke="oklch(1 0.37 90)"
			stroke-width={2}
		/>
	{/each}
</DopplerSvg>

<style>
</style>
