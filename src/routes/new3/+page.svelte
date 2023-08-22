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

	const size = 2 ** 12;
	const r = size / 10.5;
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
		lines.push([radialPoint(a, radii[2] + radii[1]), radialPoint(a + 60, radii[2] + radii[1])]); // hexagon
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
				stroke-width: 1;
				stroke-linejoin: bevel;
			}
			circle {
				fill: none;
				stroke: black;
				stroke-width: 3;
				/* display: none; */
			}
			line {
				stroke: black;
				stroke-width: 3;
				/* display: none; */
			}
			text {
				fill: red;
				display: none;
			}
			text.point {
				fill: blue;
			}
		</style>
		<path id="edgeStar" d={edgeStarPath} />
		<path id="faceStar" d={faceStarPath} />
		<path id="edgeStarSide" d={edgeStarSidePath} />
		<path id="faceStarOutside" d={faceStarOutsidePointPath} />
		<path id="edgeStarBottom" d={edgeStarBottom} />
		<path id="faceStarInside" class="faceStarInside" d={faceStarInside} />
		<path id="center" class="center" d={center} />
	</defs>
	<Background {size} fill="oklch(0.5 0.3 90)" />
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

	<use fill="oklch(1 0.37 105 / 0.5)" href="#edgeStar" />
	<use fill="oklch(1 0.37 105 / 0.5)" href="#faceStarOutside" />
	<use fill="oklch(1 0.37 105 / 0.5)" href="#faceStarInside" />
	<use fill="oklch(1 0.37 105 / 0.5)" href="#faceStarOutside" transform="scale(-1, 1)" />

	<use fill="oklch(1 0.37 95 / 0.5)" href="#faceStar" />
	<use fill="oklch(1 0.37 95 / 0.5)" href="#edgeStarSide" />
	<use fill="oklch(1 0.37 95 / 0.5)" href="#edgeStarBottom" transform="scale(-1, 1)" />
	<use fill="oklch(1 0.37 95 / 0.5)" href="#edgeStarSide" transform="scale(-1, 1) rotate(-120)" />
	<use fill="oklch(1 0.37 95 / 0.5)" href="#edgeStarBottom" transform="rotate(120)" />
	<use fill="oklch(1 0.37 95 / 0.5)" href="#center" transform="rotate(-120)" />

	<use fill="oklch(1 0.37 70 / 0.5)" href="#faceStar" transform="rotate(-120)" />
	<use fill="oklch(1 0.37 70 / 0.5)" href="#edgeStarSide" transform="rotate(-120)" />
	<use fill="oklch(1 0.37 70 / 0.5)" href="#edgeStarBottom" transform="scale(-1, 1) rotate(-240)" />
	<use fill="oklch(1 0.37 70 / 0.5)" href="#edgeStarSide" transform="scale(-1, 1) " />
	<use fill="oklch(1 0.37 70 / 0.5)" href="#edgeStarBottom" />
	<use fill="oklch(1 0.37 70 / 0.5)" href="#center" transform="rotate(120)" />

	<use fill="oklch(1 0.37 55 / 0.5)" href="#faceStar" transform="rotate(120)" />
	<use fill="oklch(1 0.37 55 / 0.5)" href="#edgeStarSide" transform="rotate(120)" />
	<use fill="oklch(1 0.37 55 / 0.5)" href="#edgeStarBottom" transform="scale(-1, 1) rotate(-120)" />
	<use fill="oklch(1 0.37 55 / 0.5)" href="#edgeStarSide" transform="scale(-1, 1) rotate(120)" />
	<use fill="oklch(1 0.37 55 / 0.5)" href="#edgeStarBottom" transform="rotate(-120)" />
	<use fill="oklch(1 0.37 55 / 0.5)" href="#center" transform="rotate()" />

	<use fill="oklch(1 0.37 40 / 0.5)" href="#edgeStar" transform="rotate(120)" />
	<use fill="oklch(1 0.37 40 / 0.5)" href="#faceStarOutside" transform="rotate(120)" />
	<use fill="oklch(1 0.37 40 / 0.5)" href="#faceStarInside" transform="rotate(120)" />
	<use
		fill="oklch(1 0.37 40 / 0.5)"
		href="#faceStarOutside"
		transform="scale(-1, 1) rotate(-120)"
	/>

	<use fill="oklch(0.98 0.37 35 / 0.5)" href="#edgeStar" transform="rotate(-120)" />
	<use fill="oklch(0.98 0.37 35 / 0.5)" href="#faceStarOutside" transform="rotate(-120)" />
	<use fill="oklch(0.98 0.37 35 / 0.5)" href="#faceStarInside" transform="rotate(-120)" />
	<use
		fill="oklch(0.98 0.37 35 / 0.5)"
		href="#faceStarOutside"
		transform="scale(-1, 1) rotate(120)"
	/>
</DopplerSvg>
