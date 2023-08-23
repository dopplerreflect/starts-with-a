<script lang="ts">
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		Phi,
		anglesArray,
		pointToString as ps,
		radialPoint,
		starPath,
		viewBox
	} from '$lib/geometry';

	const size = 2 ** 9;
	const angles = anglesArray(6);
	const r = size / 11;
	const radii = [r, r * Phi, r * Phi ** 2];
	const vr = Math.sqrt(radii[2] ** 2 - (radii[2] / 2) ** 2) * 2; // radius to vesica formed by circle 3
</script>

<DopplerSvg id="new4" viewBox={viewBox(size)}>
	<defs>
		<style>
			circle,
			path {
				stroke: oklch(90% 0.37 90);
				stroke-width: 1;
				fill: none;
			}
			circle.dim {
				stroke: oklch(0.33 0.2 300);
				stroke-width: 1;
			}
			circle.mask {
				fill: black;
			}
			path.blur {
				stroke-width: 3;
				filter: url(#blur);
			}
		</style>
		<filter id="blur">
			<feGaussianBlur in="SourceGraphic" stdDeviation="3" />
		</filter>
	</defs>
	<circle class="dim" r={radii[1]} />
	{#each angles as a}
		<circle
			class="dim"
			r={radii[1]}
			cx={radialPoint(a, radii[2]).x}
			cy={radialPoint(a, radii[2]).y}
		/>
		<circle
			class="dim"
			r={radii[2]}
			cx={radialPoint(a, radii[2]).x}
			cy={radialPoint(a, radii[2]).y}
		/>
	{/each}
	<circle class="dim" r={radii[2]} />
	<circle class="dim" r={radii[2] + radii[1]} />
	<path class="blur" d={starPath(radii[2] + radii[1])} stroke-linejoin="bevel" />
	<path d={starPath(radii[2] + radii[1])} stroke-linejoin="bevel" />
</DopplerSvg>
