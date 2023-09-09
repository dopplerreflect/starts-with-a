<svelte:options namespace="svg" />

<script lang="ts">
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		Phi,
		SQRT3,
		anglesArray,
		circleIntersections,
		circleLineIntersections,
		intersection,
		phi,
		pointToString,
		radialPoint
	} from '$lib/geometry';

	const size = 2 ** 10;
	const ro = size / 4.1;
	const angles = anglesArray(10);
	const radii = [ro, ro * phi, ro * phi ** 2];
	const circles: Circle[] = angles
		.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) })))
		.flat();
	const r1 = ro * Phi;
	const ci: Point = circleIntersections(circles[0], circles[3])[0];
	const r2 = Math.sqrt(ci.x ** 2 + ci.y ** 2);
	const ci2: Point = circleIntersections(circles[27], circles[4])[0];
	const l1: Line = [
		{ x: circles[29].x, y: ci2.y },
		{ x: circles[3].x, y: ci2.y }
	];
	const l2: Line = [radialPoint(angles[0] - 18, r2), radialPoint(angles[5] + 18, r2)];
	const l3: Line = [radialPoint(angles[0] + 18, r2), radialPoint(angles[5] - 18, r2)];
	const l4: Line = [
		{ x: circles[26].x - radii[1], y: circles[8].y },
		{ x: circles[8].x + radii[1], y: circles[8].y }
	];
	const l5: Line = [
		{ x: circles[23].x - radii[1], y: circles[11].y },
		{ x: circles[11].x + radii[1], y: circles[11].y }
	];

	const paths: Point[][] = [
		[
			intersection(l1, l2),
			intersection(l1, l3),
			radialPoint(angles[2], ro),
			radialPoint(angles[5], radii[1] * phi),
			radialPoint(angles[8], ro)
		],
		[
			intersection(l1, l3),
			radialPoint(angles[1], radii[0] + radii[1]),
			circleLineIntersections(circles[3], l4)[1],
			circleLineIntersections(circles[10], l5)[1],
			radialPoint(angles[2], ro)
		],
		[
			radialPoint(angles[2], ro),
			circleLineIntersections(circles[10], l5)[1],
			radialPoint(angles[4], radii[0] + radii[1]),
			radialPoint(angles[5], radii[0] + radii[2]),
			radialPoint(angles[5], radii[1] * phi)
		],
		[
			radialPoint(angles[5], radii[1] * phi),
			radialPoint(angles[5], radii[0] + radii[2]),
			radialPoint(angles[6], radii[0] + radii[1]),
			circleLineIntersections(circles[22], l5)[0],
			radialPoint(angles[8], ro)
		],
		[
			radialPoint(angles[8], ro),
			circleLineIntersections(circles[22], l5)[0],
			circleLineIntersections(circles[27], l4)[0],
			radialPoint(angles[9], radii[0] + radii[1]),
			intersection(l1, l2)
		]
	];
</script>

<DopplerSvg {size} id="new6">
	<g id="guide">
		{#each circles as c, i}
			<circle id={`c${i}`} r={c.r} cx={c.x} cy={c.y} />
		{/each}
		<!-- <circle r={r1} /> -->
		<!-- <circle r={r2} /> -->
		<!-- <line x1={l1[0].x} y1={l1[0].y} x2={l1[1].x} y2={l1[1].y} /> -->
		<line x1={l2[0].x} y1={l2[0].y} x2={l2[1].x} y2={l2[1].y} />
		<line x1={l3[0].x} y1={l3[0].y} x2={l3[1].x} y2={l3[1].y} />
		<line x1={l4[0].x} y1={l4[0].y} x2={l4[1].x} y2={l4[1].y} />
		<line x1={l5[0].x} y1={l5[0].y} x2={l5[1].x} y2={l5[1].y} />
	</g>

	<g id="figure" transform="rotate(180)">
		{#each paths as path, i}
			<path d={`M${path.map((p) => pointToString(p)).join(' ')}Z`} />
		{/each}
	</g>
</DopplerSvg>

<style>
	circle {
		fill: none;
	}
	circle,
	line {
		stroke: grey;
	}
	path {
		stroke: yellow;
		stroke-width: 2;
		stroke-linejoin: bevel;
		fill: yellow;
		fill-opacity: 0.25;
	}
	#guide {
		/* display: none; */
	}
</style>
