<svelte:options namespace="svg" />

<script lang="ts">
	import { anglesArray, arrayMap, viewBox } from '$lib/geometry';

	const size = 2 ** 8;
	const r = 13;
</script>

<svg viewBox={viewBox(size)} transform="rotate(90)">
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
		<path d={`M${-r * 3} 0H${r * 3}M0 ${-r * 4}V${r * 4}`} />
		<circle r={r * 5} cx={r * 3} />
		<circle r={r * 5} cy={r * 4} />
		<circle r={r * 5} cx={-r * 3} />
		<circle r={r * 5} cy={-r * 4} />
	</g>
	<!-- <use href="#345" transform="rotate(90)" /> -->
</svg>
