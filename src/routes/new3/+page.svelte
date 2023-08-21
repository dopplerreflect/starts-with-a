<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		Phi,
		anglesArray,
		circleLineIntersections,
		intersection,
		midpoint,
		pointToString,
		radialPoint,
		viewBox
	} from '$lib/geometry';
	import { text } from 'svelte/internal';

	const size = 2 ** 10;
	const r = size / 12;
	const radii = [r, r * Phi, r * Phi ** 2];
	const vpr = Math.sqrt(radii[2] ** 2 - (radii[2] / 2) ** 2) * 2; // radius to vesica formed by circle 3
	const angles = anglesArray(6);
	const circles: Circle[] = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...angles
			.map((a) =>
				radii.map((r) => ({ r, x: radialPoint(a, radii[2]).x, y: radialPoint(a, radii[2]).y }))
			)
			.flat()
	];
	const lines: Line[] = angles.map((a) => [radialPoint(a, radii[2] * Phi), { x: 0, y: 0 }]);
	angles.forEach((a) => {
		lines.push([radialPoint(a - 30, vpr), radialPoint(a - 150, vpr)]); // hexagram from vesicas
		lines.push([radialPoint(a - 30, vpr), radialPoint(a - 90, vpr)]); // hexagon from vesicas
		// outer perimeter:
		// lines.push([radialPoint(a - 30, vpr), radialPoint(a, radii[2] + radii[1])]);
		// lines.push([radialPoint(a + 30, vpr), radialPoint(a, radii[2] + radii[1])]);
		lines.push([radialPoint(a, radii[2] + radii[1]), radialPoint(a + 60, radii[2] + radii[1])]); // hexagon
		// lines.push([
		// 	radialPoint(a - 60, radii[1], { center: radialPoint(a, radii[2]) }),
		// 	radialPoint(a + 60, radii[1], { center: radialPoint(a, radii[2]) })
		// ]); // bottom of pentagram
	});
	anglesArray(3).forEach((a) => {
		lines.push([
			radialPoint(a - 30, vpr),
			radialPoint(a + 60, radii[1], { center: radialPoint(a, radii[2]) })
		]); // bottom-left diag of pentagram
		lines.push([
			radialPoint(a + 30, vpr),
			radialPoint(a - 60, radii[1], { center: radialPoint(a, radii[2]) })
		]); // bottom-right diag of pentagram
		lines.push([
			radialPoint(a + 60, radii[1], { center: radialPoint(a, radii[2]) }),
			radialPoint(a + 60, radii[1], { center: radialPoint(a + 120, radii[2]) })
		]); // connect bottom of pentagons
		lines.push([
			radialPoint(a + 60, radii[1], { center: radialPoint(a, radii[2]) }),
			radialPoint(a + 120, radii[1])
		]);
		lines.push([
			radialPoint(a - 60, radii[1], { center: radialPoint(a, radii[2]) }),
			radialPoint(a - 120, radii[1])
		]);
		lines.push([radialPoint(a + 60, radii[2] + radii[1]), radialPoint(a, radii[1])]);
		lines.push([radialPoint(a + 60, radii[2] + radii[1]), radialPoint(a + 120, radii[1])]);
	});

	const points: Point[] = [
		{ x: 0, y: -(radii[1] + radii[2]) },
		intersection(lines[10], lines[8]),
		radialPoint(-60, vpr),
		intersection(lines[8], lines[25]),
		radialPoint(-30, radii[1], { center: radialPoint(-90, radii[2]) }),
		{ x: 0, y: -radii[2] - radii[0] },
		radialPoint(-150, radii[1], { center: radialPoint(-90, radii[2]) }),
		intersection(lines[23], lines[24]),
		radialPoint(-120, vpr),
		intersection(lines[10], lines[23]),

		intersection(lines[15], lines[29]),
		radialPoint(-30, radii[2] + radii[1]),
		intersection(lines[26], lines[30]),
		radialPoint(-30, radii[1], { center: radialPoint(30, radii[2]) }),
		intersection(lines[15], lines[30]),
		radialPoint(30, radii[1]),
		radialPoint(-30, radii[1]),
		radialPoint(-90, radii[1]),
		radialPoint(-150, radii[0], { center: radialPoint(-30, radii[2]) }),
		intersection(lines[8], lines[13]),
		circleLineIntersections(circles[6], lines[26])[0],
		{ x: 0, y: -radii[2] - radii[0] + radii[1] },
		intersection(lines[9], lines[28])
	];

	const edgeStarPath = `M${points
		.slice(0, 10)
		.map((p) => pointToString(p))
		.join(' ')}Z`;

	const faceStarPath = `M${pointToString(points[4])} ${points
		.slice(10, 19)
		.map((p) => pointToString(p))
		.join(' ')}Z`;

	const edgeStarSidePath = `M${[points[2], points[3], points[4], points[20], points[19]]
		.map((p) => pointToString(p))
		.join(' ')}Z`;

	const faceStarOutsidePointPath = `M${[points[10], points[11], points[19], points[20]]
		.map((p) => pointToString(p))
		.join(' ')}Z`;

	const edgeStarBottom = `M${[points[5], points[4], points[18], points[21]]
		.map((p) => pointToString(p))
		.join(' ')}Z`;

	const faceStarInside = `M${[points[17], points[18], points[21], points[22]]
		.map((p) => pointToString(p))
		.join(' ')}Z`;

	const center = `M${[
		{ x: 0, y: 0 },
		radialPoint(-30, radii[1]),
		radialPoint(-90, radii[1]),
		radialPoint(-150, radii[1])
	]
		.map((p) => pointToString(p))
		.join(' ')}Z`;
</script>

<DopplerSvg id="new3" viewBox={viewBox(size)}>
	<defs>
		<style>
			path:not(.Background) {
				stroke: black;
				stroke-width: 3;
			}
			circle {
				stroke: black;
				fill: none;
			}
			circle {
				stroke: grey;
			}
			line {
				stroke: black;
				stroke-width: 1;
			}
			text {
				fill: red;
				display: none;
			}
			text.point {
				fill: blue;
			}
			path.edgeStar {
				fill: oklch(0.37 0.5 240 / 0.25);
			}
			path.edgeStarSide,
			path.faceStarOutside,
			path.edgeStarBottom,
			path.faceStarInside,
			path.center {
				fill: oklch(0.37 0.5 180 / 0.25);
			}
		</style>
		<path id="edgeStar" class="edgeStar" d={edgeStarPath} fill="blue" />
		<path id="faceStar" class="edgeStar" d={faceStarPath} fill="blue" />
		<g id="edgeStarSide">
			<path class="edgeStarSide" d={edgeStarSidePath} />
			<path class="edgeStarSide" d={edgeStarSidePath} transform="scale(-1, 1)" />
		</g>
		<g id="faceStarOutside">
			<path class="faceStarOutside" d={faceStarOutsidePointPath} />
			<path class="faceStarOutside" d={faceStarOutsidePointPath} transform="scale(-1, 1)" />
		</g>
		<g id="edgeStarBottom">
			<path class="edgeStarBottom" d={edgeStarBottom} />
			<path class="edgeStarBottom" d={edgeStarBottom} transform="scale(-1, 1)" />
		</g>
		<path id="faceStarInside" class="faceStarInside" d={faceStarInside} />
		<path id="center" class="center" d={center} />
	</defs>
	<Background {size} fill="white" />
	{#each circles as c, i}
		<circle id={`c${i}`} r={c.r} cx={c.x} cy={c.y} />
	{/each}
	{#each lines as l, i}
		<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		<text
			x={midpoint(l).x}
			y={midpoint(l).y}
			alignment-baseline="middle"
			text-anchor="middle"
			font-size={size / 45}>{i}</text
		>
	{/each}

	<!-- {#each points as p, i}
		<circle class="point" r={20} cx={p.x} cy={p.y} />
		<text
			class="point"
			x={p.x}
			y={p.y}
			alignment-baseline="middle"
			text-anchor="middle"
			font-size={size / 45}>{i}</text
		>
	{/each} -->

	<use href="#edgeStar" />
	<use href="#edgeStar" transform="rotate(120)" />
	<use href="#edgeStar" transform="rotate(240)" />
	<use href="#faceStar" />
	<use href="#faceStar" transform="rotate(120)" />
	<use href="#faceStar" transform="rotate(240)" />

	<use href="#edgeStarSide" />
	<use href="#edgeStarSide" transform="rotate(120)" />
	<use href="#edgeStarSide" transform="rotate(240)" />

	<use href="#faceStarOutside" />
	<use href="#faceStarOutside" transform="rotate(120)" />
	<use href="#faceStarOutside" transform="rotate(240)" />

	<use href="#edgeStarBottom" />
	<use href="#edgeStarBottom" transform="rotate(120)" />
	<use href="#edgeStarBottom" transform="rotate(240)" />

	<use href="#faceStarInside" />
	<use href="#faceStarInside" transform="rotate(120)" />
	<use href="#faceStarInside" transform="rotate(240)" />

	<use href="#center" />
	<use href="#center" transform="rotate(120)" />
	<use href="#center" transform="rotate(240)" />
</DopplerSvg>
