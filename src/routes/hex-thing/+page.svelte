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
	const radii1 = radii0.slice(0, 3).map((r) => SQRT3 * r);
	const radii = [...radii0, ...radii1, Math.sqrt(radii0[0] ** 2 + radii1[1] ** 2)].sort(
		(a, b) => a - b
	);
	let a2 = 30 - Math.atan(radii[0] / radii[4]) * (180 / Math.PI);
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
	<Background {size} fill="hsl(270, 100%, 20%)" />
	<g id="whole" transform="rotate(0)">
		{#each angles as a, i}
			<path d={`M0 0L${radialPointString(a, radii[7])}`} stroke="white" />
			<text
				x={radialPoint(a, radii[8]).x}
				y={radialPoint(a, radii[8]).y}
				text-anchor="middle"
				alignment-baseline="middle"
				fill="white">{i}</text
			>
		{/each}
		{#each radii as r, i}
			<circle {r} stroke="white" stroke-width={1} fill="none" />
			<path d={`M${-size / 2 + 30} ${-r}H0`} stroke="white" />
			<text x={-size / 2 + 20} y={-r} fill="white" alignment-baseline="middle" text-anchor="middle"
				>{i}</text
			>
		{/each}
		{#each angles6 as a}
			<circle
				r={radii[0]}
				cx={radialPoint(a, radii[2]).x}
				cy={radialPoint(a, radii[2]).y}
				stroke="white"
				fill="none"
			/>
			<!-- <path
				d={`M${radialPointString(a, radii[2])}L${radialPointString(a + 60, radii[2])}`}
				stroke="blue"
			/> -->
			<path
				d={`M${radialPointString(a + 30, radii0[0] * SQRT3)}L${radialPointString(
					a + 90,
					radii[0] * SQRT3
				)}`}
				stroke="red"
				stroke-width={3}
			/>
			<circle
				r={radii[0]}
				cx={radialPoint(a + 30, radii[2] * SQRT3).x}
				cy={radialPoint(a + 30, radii[2] * SQRT3).y}
				stroke="white"
				fill="none"
			/>
			<circle
				r={radii[0]}
				cx={radialPoint(a, radii[6]).x}
				cy={radialPoint(a, radii[6]).y}
				stroke="white"
				fill="none"
			/>
			<!-- <path
				d={`M${radialPointString(a, radii[6])}L${radialPointString(a + 60, radii[6])}`}
				stroke="blue"
			/> -->
			<path
				d={`M${radialPointString(a + 30, radii[2] * SQRT3)}L${radialPointString(
					a + 90,
					radii[2] * SQRT3
				)}`}
				stroke="red"
				stroke-width={3}
			/>
			<path
				d={parse('M22 2L23 5L1 5L2 2Z')}
				stroke="red"
				stroke-width={3}
				fill="none"
				transform={`rotate(${a})`}
			/>
			<path
				d={`M0 0V${-radii[1]}H${radii[2]}V0Z`}
				stroke="red"
				stroke-width="3"
				fill="none"
				transform={`rotate(${a})`}
			/>
			<path
				d={`M0 0V${-radii[1]}H${-radii[2]}V0Z`}
				stroke="red"
				stroke-width="3"
				fill="none"
				transform={`rotate(${a})`}
			/>
		{/each}
		<!-- <PathBuilder {angles} {radii} /> -->
	</g>
</svg>
