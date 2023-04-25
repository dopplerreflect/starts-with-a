<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import {
		anglesArray,
		arrayMap,
		circleIntersections,
		circleLineIntersections,
		polygonPath,
		radialPoint,
		radialPointString,
		viewBox,
		phi,
		Phi,
		phylotaxicPoints
	} from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte/internal';

	const size = 2 ** 10;
	const r = size / 7;

	const angles6 = anglesArray(6, 0);
	const angles5 = anglesArray(5);
	const centerPoints = angles6.map((a) => radialPoint(a, r));
	const smallCircles = centerPoints.map((p) => ({ ...p, r }));
	const largeCircles = centerPoints.map((p) => ({ ...p, r: r * 2 }));
	const radii = [1, 3, 5]
		.map((i) => circleIntersections(largeCircles[0], largeCircles[i])[0])
		.flat()
		.map((i) => Math.sqrt(i.x ** 2 + i.y ** 2));
	const hexLine: Line = [
		radialPoint(angles6[0] - 30, radii[0]),
		radialPoint(angles6[1] - 30, radii[0])
	];
	const hexLineLargeCircleIntersection = circleLineIntersections(largeCircles[1], hexLine)[0];
	const angleToHexLineLargeCircleIntersection =
		Math.atan2(hexLineLargeCircleIntersection.y, hexLineLargeCircleIntersection.x) *
		(180 / Math.PI);
	const hexlineAngles = arrayMap(6, (n) => 60 * n)
		.map((n) => [
			n + 30 + angleToHexLineLargeCircleIntersection,
			n + 30 - angleToHexLineLargeCircleIntersection
		])
		.flat();
	const angles = [...angles6, ...anglesArray(6, 30), ...hexlineAngles]
		.map((a) => a - 30)
		.sort((a, b) => a - b);
	radii.push(
		Math.sqrt(hexLineLargeCircleIntersection.x ** 2 + hexLineLargeCircleIntersection.y ** 2)
	);
	radii.push(r * 3);
	radii.sort((a, b) => b - a);

	const parse = pathFromDSL(angles, radii);

	let svg: SVGSVGElement;
	onMount(() => {
		const unMountSave = useSaveFile(svg);
		const unmountZoom = useZoomableViewbox(svg);
		return () => {
			unMountSave();
			unmountZoom();
		};
	});
</script>

<svg bind:this={svg} id="sprout-of-life" viewBox={viewBox(size)}>
	<defs>
		<style>
			#guide {
				/* display: none; */
			}
			#guide circle,
			#guide path {
				stroke: oklch(1 0.37 150);
				fill: none;
			}
			#guide text {
				fill: oklch(1 0.37 0);
			}
			#dodecahedron .pentagram {
				display: none;
				stroke: oklch(1 0.37 150 / 1);
				fill: oklch(0.25 0.37 150 / 1);
			}
		</style>
		<g id="guide" stroke-width={size / 2 ** 9}>
			{#each smallCircles as c}
				<circle cx={c.x} cy={c.y} r={c.r} />
			{/each}
			{#each largeCircles as c, i}
				<circle cx={c.x} cy={c.y} r={c.r} />
			{/each}
			<!-- {#each radii as r, i}
				<circle {r} />
			{/each} -->
			<!-- {#each angles as a, i}
				<path d={`M${radialPointString(a, radii[4])}L${radialPointString(a, radii[0])}`} />
			{/each} -->
			<!-- <path d={polygonPath(6, radii[1])} /> -->
		</g>
	</defs>
	<Background {size} fill="oklch(0.1 0.125 300)" />
	{#each phylotaxicPoints(2 ** 10, Math.sqrt((size / 2) ** 2 * 2)) as p, i}
		<circle
			cx={p.x}
			cy={p.y}
			r={2 + i / 2 ** 5}
			stroke={`oklch(${0.75 - (0.75 / 2 ** 10) * i} 0.125 300)`}
			fill="none"
		/>
	{/each}
	<use href="#guide" transform={`scale(${phi ** 3})`} />
	<use
		href="#guide"
		transform={`scale(${phi ** 2}) translate(${radialPointString(angles5[0], radii[0] * Phi)})`}
	/>
	<use
		href="#guide"
		transform={`scale(${phi ** 2}) translate(${radialPointString(angles5[1], radii[0] * Phi)})`}
	/>
	<use
		href="#guide"
		transform={`scale(${phi ** 2}) translate(${radialPointString(angles5[2], radii[0] * Phi)})`}
	/>
	<use
		href="#guide"
		transform={`scale(${phi ** 2}) translate(${radialPointString(angles5[3], radii[0] * Phi)})`}
	/>
	<use
		href="#guide"
		transform={`scale(${phi ** 2}) translate(${radialPointString(angles5[4], radii[0] * Phi)})`}
	/>

	<g
		id="tetrahedron"
		transform={`scale(${phi ** 2}) translate(${radialPointString(angles5[0], radii[0] * Phi)})`}
		stroke={`oklch(1 0.37 30)`}
		stroke-width={size / 2 ** 9}
	>
		{#each anglesArray(3, 0) as a, i}
			<path
				d={`M0 0` + parse('L20 1L4 1L12 1Z')}
				transform={`rotate(${a})`}
				fill={`oklch(${0.3 + 0.3 * i} 0.37 30 / 0.2)`}
			/>
		{/each}
	</g>

	<g
		id="cube"
		stroke={`oklch(1 0.37 90)`}
		stroke-width={size / 2 ** 9}
		transform={`scale(${phi ** 2}) translate(${radialPointString(angles5[1], radii[0] * Phi)})`}
	>
		{#each anglesArray(3) as a, i}
			<path
				d={parse('M16 2L20 2L0 2') + 'L0 0Z'}
				fill={`oklch(${0.25 + 0.25 * i} 0.37 90 / 0.33)`}
				transform={`rotate(${a - angleToHexLineLargeCircleIntersection})`}
			/>
		{/each}
	</g>

	<g
		id="octahedron"
		stroke={`oklch(1 0.37 120)`}
		stroke-width={size / 2 ** 9}
		fill-opacity={0.33}
		transform={`scale(${phi ** 2}) translate(${radialPointString(
			angles5[2],
			radii[0] * Phi
		)}) rotate(${-angleToHexLineLargeCircleIntersection}) `}
	>
		<path d={parse('M18 2L2 2L10 2Z')} fill={`oklch(1 0.37 120)`} />
		{#each anglesArray(3, 0) as a, i}
			<path
				d={parse('M18 2L22 2L2 2Z')}
				fill={`oklch(${0.25 + 0.25 * i} 0.37 120)`}
				transform={`rotate(${a})`}
			/>
		{/each}
	</g>

	<g
		id="dodecahedron"
		stroke={`oklch(1 0.37 150)`}
		stroke-width={size / 2 ** 9}
		transform={`scale(${phi ** 2}) translate(${radialPointString(angles5[3], radii[0] * Phi)})`}
	>
		{#each anglesArray(3) as a, i}
			<g transform={`rotate(${a - 30})`} fill-opacity={0.5}>
				<path d={parse(`M17 2L19 2L21 2L23 2L20 3Z`)} fill={`oklch(${0.15 + 0.15 * i} 0.37 150)`} />
				<path
					d={parse(`M20 3L23 2L1 2L4 3`) + 'L0 0Z'}
					fill={`oklch(${0.45 + 0.15 * i} 0.37 150)`}
				/>
				<path class="pentagram" d={parse(`M17 2L21 2L20 3L19 2L23 2Z`)} />
				<path class="pentagram" d={'M0 0' + parse(`L23 2L4 3L20 3L1 2Z`)} />
			</g>
		{/each}
	</g>

	<g
		id="icosahedron"
		stroke={` oklch(1 0.37 240 / 1)`}
		stroke-width={size / 2 ** 9}
		transform={`scale(${phi ** 2}) translate(${radialPointString(angles5[4], radii[0] * Phi)})`}
	>
		<path d={parse('M16 3L0 3L8 3Z')} fill={` oklch(0.6 0.37 240 / 0.5)`} />
		{#each anglesArray(3) as a, i}
			<g transform={`rotate(${a - 30})`}>
				<path d={parse('M16 3L20 1L0 3Z')} fill={` oklch(${0.45 + 0.15 * i} 0.37 240 / 0.5)`} />
				<path d={parse('M20 1L0 1L0 3Z')} fill={` oklch(${0.35 + 0.15 * i} 0.37 240 / 0.5)`} />
				<path d={parse('M0 1L4 1L0 3')} fill={` oklch(${0.25 + 0.15 * i} 0.37 240 / 0.5)`} />
			</g>
		{/each}
	</g>
</svg>
