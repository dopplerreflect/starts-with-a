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
		viewBox
	} from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';
	import { useSaveFile } from '$lib/save-svg';
	import { each, onMount } from 'svelte/internal';

	const size = 2 ** 10;
	const r = size / 7;

	const angles6 = anglesArray(6, 0);
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
		return () => {
			unMountSave();
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
				stroke: oklch(0 0.37 300);
				fill: none;
			}
			#guide text {
				fill: oklch(0 0.37 300);
			}
			#dodecahedron path {
				stroke: oklch(0 0.37 300 / 1);
				fill: oklch(0.25 0.37 300 / 0.33);
				/* fill: none; */
			}
			#dodecahedron .pentagram {
				stroke: oklch(0 0.37 300 / 1);
				fill: oklch(0.25 0.37 300 / 0.33);
				/* fill-rule: evenodd; */
			}
		</style>
	</defs>
	<Background {size} fill="oklch(1 0.125 300)" />
	<g id="guide" stroke-width={size / 2 ** 11}>
		{#each smallCircles as c}
			<circle cx={c.x} cy={c.y} r={c.r} />
		{/each}
		{#each largeCircles as c, i}
			<circle cx={c.x} cy={c.y} r={c.r} />
		{/each}
		{#each radii as r, i}
			<circle {r} />
			<path d={`M${-size / 2 + size / 24} ${-r}H0`} />
			<text
				font-size={size / 48}
				x={-size / 2 + size / 48}
				y={-r}
				fill="white"
				text-anchor="middle"
				alignment-baseline="middle">{i}</text
			>
		{/each}
		{#each angles as a, i}
			<path d={`M${radialPointString(a, radii[4])}L${radialPointString(a, radii[0])}`} />
			<text
				font-size={size / 48}
				x={radialPoint(a, radii[0] + size / 48).x}
				y={radialPoint(a, radii[0] + size / 48).y}
				fill="white"
				text-anchor="middle"
				alignment-baseline="middle">{i}</text
			>
		{/each}
		<path d={polygonPath(6, radii[1])} />
	</g>
	<g id="dodecahedron" stroke-width={size / 2 ** 9}>
		{#each anglesArray(3) as a}
			<g transform={`rotate(${a - 30})`}>
				<path d={parse(`M17 2L19 2L21 2L23 2L20 3Z`)} />
				<path d={parse(`M20 3L23 2L1 2L4 3`) + 'L0 0Z'} />
				<path class="pentagram" d={parse(`M17 2L21 2L20 3L19 2L23 2Z`)} />
				<path class="pentagram" d={'M0 0' + parse(`L23 2L4 3L20 3L1 2Z`)} />
			</g>
		{/each}
	</g>
</svg>
