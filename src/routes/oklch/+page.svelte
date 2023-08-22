<script lang="ts">
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, viewBox } from '$lib/geometry';

	const size = 2 ** 10;
	const angles = anglesArray(360 / 15, 0);
	const rectSize = size / angles.length;
</script>

<DopplerSvg viewBox={viewBox(size)} id="oklch">
	{#each angles as a, i}
		<path
			d={`M${-size / 2} ${-size / 2 + i * rectSize}h${rectSize}v${rectSize}h${-rectSize}Z`}
			fill={`oklch(75% 0.3 ${a})`}
		/>
		<text
			text-anchor="middle"
			alignment-baseline="middle"
			fill="white"
			x={-size / 2 + rectSize / 2}
			y={-size / 2 + i * rectSize + rectSize / 2}>{a}</text
		>
	{/each}
</DopplerSvg>
