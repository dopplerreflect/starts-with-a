<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import PathBuilder from '$lib/components/PathBuilder.svelte';
	import { SQRT3, arrayMap, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';
	import { pathFromDSL } from '$lib/path-parser';
	import { useSaveFile } from '$lib/save-svg';
	const size = 1200;
	const radii0 = arrayMap(5, (n) => (size / 11) * (n + 1));
	let r3 = 2 * (radii0[1] / SQRT3);
	const radii1 = radii0.slice(0, 3).map((r) => SQRT3 * r);
	const radii = [
		...radii0,
		...radii1,
		Math.sqrt(radii0[0] ** 2 + radii1[1] ** 2),
		2 * (radii0[1] / SQRT3)
	].sort((a, b) => a - b);
	let a2 = 30 - Math.atan(radii[0] / radii[5]) * (180 / Math.PI);
	const angles12 = arrayMap(12, (n) => 30 * n - 90);
	const angles6 = angles12.filter((a) => a % 60 === 0);
	const atanAngles = angles6.map((a) => [a - a2, a + a2]).flat();
	const angles = [...angles12, ...atanAngles].sort((a, b) => a - b);

	const parse = pathFromDSL(angles, radii);
	let svg: SVGSVGElement;
	onMount(() => {
		const unmountZoomable = useZoomableViewbox(svg);
		const unmountSaveFile = useSaveFile(svg);
		return () => {
			unmountZoomable();
			unmountSaveFile();
		};
	});
</script>

<svg id="hex-thing" bind:this={svg} viewBox={viewBox(size)}>
	<defs>
		<style>
			.guide {
				stroke: hsl(270, 50%, 66%);
			}
		</style>
	</defs>
	<Background {size} fill="hsl(270, 100%, 90%)" />

	<g id="whole" transform="rotate(0)">
		<g class="guide">
			{#each angles as a, i}
				<path d={`M0 0L${radialPointString(a, radii[9])}`} />
				<text
					x={radialPoint(a, radii[9]).x}
					y={radialPoint(a, radii[9]).y}
					text-anchor="middle"
					alignment-baseline="middle">{i}</text
				>
			{/each}
			{#each radii as r, i}
				<circle {r} stroke-width={1} fill="none" />
				<path d={`M${-size / 2 + 30} ${-r}H0`} />
				<text x={-size / 2 + 20} y={-r} alignment-baseline="middle" text-anchor="middle">{i}</text>
			{/each}
		</g>
		{#each angles6 as a}
			<circle
				class="guide"
				r={radii[0]}
				cx={radialPoint(a, radii[2]).x}
				cy={radialPoint(a, radii[2]).y}
				fill="none"
			/>
			<circle
				class="guide"
				r={radii[0]}
				cx={radialPoint(a + 30, radii[2] * SQRT3).x}
				cy={radialPoint(a + 30, radii[2] * SQRT3).y}
				fill="none"
			/>
			<circle
				class="guide"
				r={radii[0]}
				cx={radialPoint(a, radii[7]).x}
				cy={radialPoint(a, radii[7]).y}
				fill="none"
			/>
			<path
				class="guide"
				d={`M${radialPointString(a + 30, radii[2] * SQRT3)}L${radialPointString(
					a + 90,
					radii[2] * SQRT3
				)}`}
				stroke="hsl(270, 100%, 20%)"
				stroke-linejoin="round"
			/>
			<path
				d={`M${radialPointString(a + 30, radii0[0] * SQRT3)}L${radialPointString(
					a + 90,
					radii[0] * SQRT3
				)}`}
				stroke="hsl(270, 100%, 20%)"
				stroke-width={3}
				stroke-linejoin="round"
			/>
			<path
				d={parse('M22 2L23 6L1 6L2 2Z')}
				stroke="hsl(270, 100%, 20%)"
				stroke-width={3}
				stroke-linejoin="round"
				fill="none"
				transform={`rotate(${a})`}
			/>
			<path
				d={`M${-radii[2]} ${-radii[1]}H${radii[2]}V0H${-radii[2]}Z`}
				stroke="hsl(270, 100%, 20%)"
				stroke-width={3}
				stroke-linejoin="round"
				fill="none"
				transform={`rotate(${a})`}
			/>
		{/each}
		<path
			d={parse(
				'M23 6A0 0 0 0 0 1 6A0 0 0 0 0 3 6A0 0 0 0 0 5 6A0 0 0 0 0 7 6A0 0 0 0 0 9 6A0 0 0 0 0 11 6A0 0 0 0 0 13 6A0 0 0 0 0 15 6A0 0 0 0 0 17 6A0 0 0 0 0 19 6A0 0 0 0 0 21 6A0 0 0 0 0 23 6M0 0A0 0 0 1 1 23 0 Z'
			)}
			stroke="hsl(270, 100%, 20%)"
			stroke-width={3}
			fill="none"
			fill-rule="evenodd"
			transform={`rotate(${0})`}
		/>

		<!-- <PathBuilder {angles} {radii} /> -->
	</g>
</svg>
