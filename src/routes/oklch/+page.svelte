<script lang="ts">
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, arrayMap, viewBox } from '$lib/geometry';

	const size = 2 ** 10;
	const angles = anglesArray(360 / 30, 0);
	const rectSize = size / angles.length;
	const cols = arrayMap(12, (n) => n);
</script>

<DopplerSvg viewBox={viewBox(size)} id="oklch">
	{#each cols as x}
		{#each angles as a, y}
			<path
				d={`M${-size / 2 + x * rectSize} ${
					-size / 2 + y * rectSize
				}h${rectSize}v${rectSize}h${-rectSize}Z`}
				fill={`oklch(${(x + 1) * 8.33}% 0.37 ${a})`}
			/>
			{#if y === 0}
				<text
					font-size={24}
					text-anchor="middle"
					alignment-baseline="middle"
					fill="white"
					x={-size / 2 + x * rectSize + rectSize / 2}
					y={-size / 2 + y * rectSize + rectSize / 2}>{Math.round((x + 1) * 8.33)}</text
				>
			{/if}
			{#if x === 0}
				<text
					font-size={24}
					text-anchor="middle"
					alignment-baseline="middle"
					fill="white"
					x={-size / 2 + x * rectSize + rectSize / 2}
					y={-size / 2 + y * rectSize + rectSize / 2}>{a}</text
				>
			{/if}
		{/each}
	{/each}
</DopplerSvg>
