<svelte:options namespace="svg" />

<script lang="ts">
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { viewBox } from '$lib/geometry';

	const size = 2 ** 8;
	const r = size / 19;
</script>

<DopplerSvg id="345" viewBox={viewBox(size)}>
	<defs>
		<style>
			circle,
			path {
				fill: none;
				stroke: white;
				stroke-linejoin: round;
			}
			circle {
				/* display: none; */
			}
		</style>
	</defs>
	<g id="345">
		<circle {r} />
		<circle r={r * 2} />
		<circle r={r * 3} />
		<circle r={r * 4} />
		<circle r={r * 5} />
		<path d={`M${-r * 3} 0H${r * 3}M0 ${-r * 4}V${r * 4}`} />
		<path d={`M${-r * 3} 0L0 ${-r * 4}L${r * 3} 0L0 ${r * 4}Z`} />
		<circle r={r * 5} cx={r * 3} />
		<circle r={r * 5} cy={r * 4} />
		<circle r={r * 5} cx={-r * 3} />
		<circle r={r * 5} cy={-r * 4} />
	</g>
</DopplerSvg>
