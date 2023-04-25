<svelte:options namespace="svg" />

<script lang="ts">
	import {
		anglesArray,
		arrayMap,
		circleIntersections,
		circleLineIntersections,
		radialPoint,
		radialPointString,
		viewBox
	} from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';
	const size = 2 ** 10;

	const r0 = size / 7;
	const r1 = r0 * 2;
	const sproutAngles = anglesArray(6, 0);
	const circles: Circle[] = [
		...sproutAngles.map((a) => ({ r: r1, ...radialPoint(a, r0) })),
		...sproutAngles.map((a) => ({ r: r0, ...radialPoint(a, r0) }))
	];

	const greaterLesserAngle = circleIntersections(circles[0], circles[9]).map(
		(i) => Math.atan2(i.y, i.x) * (180 / Math.PI)
	)[0];
	const greaterLesserAngles = [...Array(6).keys()]
		.map((n) => [(60 * n + greaterLesserAngle) % 360, (60 * n - greaterLesserAngle + 180) % 360])
		.flat();
	const angles = [...sproutAngles, ...sproutAngles.map((n) => n + 30), ...greaterLesserAngles].sort(
		(a, b) => b - a
	);

	console.log(circleLineIntersections(circles[0], [{ x: 0, y: 0 }, radialPoint(angles[2], size)]));
	const radii = [
		...new Set(
			[
				circleIntersections(circles[0], circles[1]),
				circleIntersections(circles[0], circles[2]),
				circleIntersections(circles[0], circles[3]),
				circleLineIntersections(circles[0], [{ x: 0, y: 0 }, radialPoint(angles[2], size / 2)])
			]
				.flat()
				.map((p) => Math.sqrt(p.x ** 2 + p.y ** 2))
		),
		r0,
		r0 * 3
	].sort((a, b) => b - a);

	const parse = pathFromDSL(angles, radii);
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<style>
			circle,
			path {
				fill: none;
				stroke: oklch(1 0 0);
			}
			circle.large {
				stroke: oklch(0.5 0.37 150);
			}
			circle.small {
				stroke: oklch(0.5 0.37 60);
			}
			.angle {
				/* display: none; */
				stroke: oklch(0.25 0.37 0);
			}
			.radius {
				/* display: none; */
				stroke: oklch(0.5 0.37 300);
			}
			.rear path {
				stroke: oklch(0.66 0 0);
			}
		</style>
	</defs>
	<g id="guide">
		{#each circles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} class={i < 6 ? 'large' : 'small'} />
		{/each}
		{#each radii as r, i}
			<circle {r} class="radius" />
			<path class="radius" d={`M${-size / 2 + size / 20} ${-r}H0`} />
			<text
				class="radius"
				x={-size / 2 + size / 40}
				y={-r}
				fill="white"
				text-anchor="middle"
				alignment-baseline="middle">{i}</text
			>
		{/each}
		{#each angles as a, i}
			<path class="angle" d={`M0 0L${radialPointString(a, radii[0])}`} stroke="red" />
			<text
				class="angle"
				x={radialPoint(a, radii[0] + size / 20).x}
				y={radialPoint(a, radii[0] + size / 20).y}
				text-anchor="middle"
				alignment-baseline="middle"
				fill="white">{i}</text
			>
		{/each}
	</g>
	<g id="dodecahedron">
		<g class="rear">
			<path id="bottom" d={parse('M14 2L16 2L18 2L20 2L17 4Z')} />
			<path id="lower-left" d={'M0 0' + parse('L17 4L14 2L12 2L9 4Z')} />
			<path id="lower-right" d={'M0 0' + parse('L17 4L20 2L22 2L1 4Z')} />
			<path id="upper-left" d={parse('M10 2L12 2L9 4L6 2L8 2Z')} />
			<path id="upper-middle" d={'M0 0' + parse('L1 4L4 2L6 2L9 4Z')} />
			<path id="upper-right" d={parse('M4 2L2 2L0 2L22 2L1 4Z')} />
		</g>
		<g class="front">
			<path id="top" d={parse('M8 2L6 2L4 2L2 2L5 4Z')} />
			<path id="upper-left" d={'M0 0' + parse('L5 4L8 2L10 2L13 4Z')} />
			<path id="upper-right" d={'M0 0' + parse('L5 4L2 2L0 2L21 4Z')} />
			<path id="lower-left" d={parse('M10 2L12 2L14 2L16 2L13 4Z')} />
			<path id="lower-middle" d={'M0 0' + parse('L13 4L16 2L18 2L21 4Z')} />
			<path id="lower-right" d={parse('M18 2L20 2L22 2L0 2L21 4Z')} />
		</g>
	</g>
</svg>
