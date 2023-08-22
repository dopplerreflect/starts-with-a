<script lang="ts">
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { Phi, anglesArray, pointToString as ps, radialPoint, viewBox } from '$lib/geometry';

	const size = 2 ** 8;
	const angles = anglesArray(6);
	const r = size / 11;
	const radii = [r, r * Phi, r * Phi ** 2];
	const vr = Math.sqrt(radii[2] ** 2 - (radii[2] / 2) ** 2) * 2; // radius to vesica formed by circle 3
	const p = anglesArray(6, 0).map((a) => radialPoint(a, vr)); // points for outer path
	const rs = `${radii[2]} ${radii[2]} 0 0 1`;
</script>

<DopplerSvg id="new4" viewBox={viewBox(size)}>
	<defs>
		<style>
			circle,
			path {
				stroke: oklch(1 0 0);
				fill: none;
			}
			circle.dim {
				stroke: oklch(0.25 0 0);
			}
		</style>
	</defs>
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
	{#each angles as a}
		<circle {r} cx={radialPoint(a, radii[2]).x} cy={radialPoint(a, radii[2]).y} />
	{/each}
	<circle {r} />
	<path
		d={`M${ps(p[0])}A${rs} ${ps(p[1])}A${rs} ${ps(p[2])}A${rs} ${ps(p[3])}A${rs} ${ps(
			p[4]
		)}A${rs} ${ps(p[5])}A${rs} ${ps(p[0])}Z`}
	/>
</DopplerSvg>
