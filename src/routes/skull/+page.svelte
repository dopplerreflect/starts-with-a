<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		Phi,
		anglesArray,
		arrayMap,
		circleIntersections,
		circleLineIntersections,
		phi,
		pointToString,
		polygonPath,
		radialPoint,
		radialPointString,
		viewBox
	} from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';

	const size = 2 ** 10;

	const r = size / 3.75;
	const angles = anglesArray(60);
	const radii = arrayMap(21, (n) => r * phi ** (n * 0.5));

	const parse = pathFromDSL(angles, radii);

	const cheekRadius = radii[0] + radii[2] - radii[3],
		upperGumRadius = radii[0] + radii[2] - radii[4];

	const anglesModifiedForUpperJawCorrection = [...angles];
	anglesModifiedForUpperJawCorrection[26] += Phi;
	anglesModifiedForUpperJawCorrection[34] -= Phi;

	const parse2 = pathFromDSL(anglesModifiedForUpperJawCorrection, [
		upperGumRadius,
		cheekRadius,
		...radii
	]);

	const jawInnerCircle: Circle = { r: radii[2], x: 0, y: radii[1] + radii[11] };
	const jawOuterCircle: Circle = { r: radii[1], x: 0, y: radii[0] + radii[10] };
	const haloCircle: Circle = { r: radii[0] * Phi, x: 0, y: 0 };
	const skullCircle: Circle = { r: radii[0], x: 0, y: 0 };

	const jawPoints = circleIntersections(haloCircle, jawOuterCircle);
	const jawSkullIntersections = circleIntersections(skullCircle, jawInnerCircle);

	const teethCircle: Circle = { r: radii[0] - radii[11], x: 0, y: radii[3] - radii[11] };

	const teethCircleSkullCircleIntersections = circleIntersections(
		{ r: radii[0], x: 0, y: 0 },
		teethCircle
	);

	const jawInnerCircleTeethCircleIntersections = circleIntersections(jawInnerCircle, teethCircle);

	const jawInnerCircleCheekCircleIntersections = circleIntersections(jawInnerCircle, {
		x: 0,
		y: 0,
		r: cheekRadius
	});

	const upperTeethAngles = [...new Set([...Array(7).keys()].map((k, i) => 90 + (8 - k / 2) * k))];

	const upperTeethAngleLines: Line[] = upperTeethAngles.map((a) => [
		{ x: teethCircle.x, y: teethCircle.y },
		radialPoint(a, teethCircle.r + 1, { center: { x: 0, y: teethCircle.y } })
	]);

	const upperTeethAngleLineIntersections: Point[] = upperTeethAngleLines
		.map((l, i) => circleLineIntersections(teethCircle, l)[0])
		.sort((a, b) => a.x - b.x);

	const upperTeethPaths = upperTeethAngleLineIntersections
		.slice(0, upperTeethAngleLineIntersections.length - 1)
		.map((t, n) => {
			const i = upperTeethAngleLineIntersections;
			let path =
				`M${t.x} ${t.y}` +
				`C${(i[n + 1].x + i[n].x) / 2 - 18} ` +
				`${t.y - 75 + Math.abs(5.55 - n) * 7.5} ` +
				`${(i[n + 1].x + i[n].x) / 2 + 18} ` +
				`${t.y - 75 + Math.abs(5.55 - n) * 7.5} ` +
				`${i[n + 1].x} ${i[n + 1].y}` +
				`Q${(i[n + 1].x + i[n].x) / 2} ` +
				`${t.y + 8} ` +
				`${t.x} ${t.y}Z`;
			return path;
		});

	const lowerTeethAngles = [...new Set([...Array(7).keys()].map((k, i) => 90 + 4.9 * k))];

	const lowerTeethAngleLines: Line[] = lowerTeethAngles.map((a) => [
		{ x: teethCircle.x, y: teethCircle.y },
		radialPoint(a, teethCircle.r + 1, { center: { x: 0, y: teethCircle.y } })
	]);

	const lowerTeethAngleLineIntersections: Point[] = lowerTeethAngleLines
		.map((l, i) => circleLineIntersections(teethCircle, l)[0])
		.sort((a, b) => a.x - b.x);

	const lowerTeethPaths = lowerTeethAngleLineIntersections
		.slice(0, lowerTeethAngleLineIntersections.length - 1)
		.map((t, n) => {
			const i = lowerTeethAngleLineIntersections;
			let path =
				`M${t.x} ${t.y}` +
				`C${(i[n + 1].x + i[n].x) / 2 - 12} ` +
				`${t.y + 30 + Math.abs(6.18 + n) * 2} ` +
				`${(i[n + 1].x + i[n].x) / 2 + 12} ` +
				`${t.y + 30 + Math.abs(6.18 + n) * 2} ` +
				`${i[n + 1].x} ${i[n + 1].y}` +
				`Q${(i[n + 1].x + i[n].x) / 2} ` +
				`${t.y + 8} ` +
				`${t.x} ${t.y}Z`;
			return path;
		});
</script>

<DopplerSvg
	zoom={0}
	yPan={-2}
	viewBox={`${-size / 2} ${-size / Math.sqrt(5)} ${size} ${size}`}
	id="skully"
>
	<defs>
		<style>
			.black {
				fill: black;
				fill-opacity: 0.5;
			}
			.bone {
				fill: oklch(0.9 0.03 100 / 1);
				stroke: black;
				stroke-width: 1;
			}
			#skull #rear {
				/* display: none; */
				fill: oklch(0.8 0.03 100 / 1);
			}
			#teeth {
				fill: oklch(1 0.03 100 / 1);
			}
			#orifices {
				/* display: none; */
			}
			image {
				display: none;
			}
			#guide {
				/* display: none; */
				fill: none;
				stroke: black;
				stroke-width: 2;
				stroke-opacity: 0.25;
			}
			text {
				/* display: none; */
				stroke: none;
				fill: black;
			}
			path.red {
				stroke: red;
				stroke-width: 3;
			}
		</style>
	</defs>
	<Background width={size} height={size * 1.3} fill="white" />

	<g id="skull" class="bone">
		<path
			id="rear"
			d={`M${pointToString(teethCircleSkullCircleIntersections[0])}` +
				`A${teethCircle.r} ${teethCircle.r} 0 0 1 ${pointToString(
					jawInnerCircleTeethCircleIntersections[1]
				)}` +
				`A${jawInnerCircle.r} ${jawInnerCircle.r} 0 0 0 ${pointToString(
					jawInnerCircleCheekCircleIntersections[1]
				)}` +
				`A${cheekRadius} ${cheekRadius} 0 0 1 ${pointToString(
					jawInnerCircleCheekCircleIntersections[0]
				)}` +
				`A${jawInnerCircle.r} ${jawInnerCircle.r} 0 0 0 ${pointToString(
					jawInnerCircleTeethCircleIntersections[0]
				)}` +
				`A${teethCircle.r} ${teethCircle.r} 0 0 1 ${pointToString(
					teethCircleSkullCircleIntersections[1]
				)}` +
				`A${radii[0]} ${radii[0]} 0 1 1 ${pointToString(teethCircleSkullCircleIntersections[0])}Z`}
		/>
		<path
			id="front"
			d={parse2(
				'M40 2Q40 1 39 1A1 1 0 0 0 37 1C36 1 37 2 36 2' +
					'Q34 2 34 0' +
					'A0 0 0 0 0 26 0' +
					'Q26 2 24 2' +
					'C23 2 24 1 23 1' +
					'A1 1 0 0 0 21 1' +
					'Q20 1 20 2' +
					'C19 2 13 4 12 2' +
					'A2 2 0 0 0 48 2' +
					'C47 4 41 2 40 2'
			)}
		/>
		<path
			id="jaw"
			d={`M${radialPointString(angles[37], cheekRadius)}Q${radialPointString(
				angles[36],
				cheekRadius
			)} ${pointToString(jawPoints[1])}A${jawOuterCircle.r} ${
				jawOuterCircle.r
			} 0 0 0 ${pointToString(jawPoints[0])}Q${radialPointString(
				angles[24],
				cheekRadius
			)} ${radialPointString(angles[23], cheekRadius)}C${radialPointString(
				angles[24],
				cheekRadius
			)} ${radialPointString(angles[23], radii[0])} ${pointToString(jawSkullIntersections[0])}A${
				jawInnerCircle.r
			} ${jawInnerCircle.r} 0 1 1 ${pointToString(jawSkullIntersections[1])}C${radialPointString(
				angles[37],
				radii[0]
			)} ${radialPointString(angles[36], cheekRadius)} ${radialPointString(
				angles[37],
				cheekRadius
			)}Z`}
		/>
	</g>

	<g id="orifices">
		<path
			id="nose"
			class="black"
			d={parse(
				`M30 1A11 11 0 0 0 28 1Q27 2 28 3S29 4 29 5A5 5 0 0 1 31 5Q31 4 32 3S33 2 32 1A 11 11 0 0 0 30 1Z`
			)}
		/>
		<circle
			id="leftEye"
			r={radii[5]}
			cx={radialPoint(angles[40], radii[3]).x}
			cy={radialPoint(angles[40], radii[3]).y}
			class="black"
		/>
		<circle
			id="rightEye"
			r={radii[5]}
			cx={radialPoint(angles[20], radii[3]).x}
			cy={radialPoint(angles[20], radii[3]).y}
			class="black"
		/>
	</g>

	<g id="teeth" class="bone">
		<g class="lower">
			<g class="left">
				{#each lowerTeethPaths as d, i}
					<path class="tooth" {d} />
				{/each}
			</g>
			<g class="right" transform="scale(-1, 1)">
				{#each lowerTeethPaths as d, i}
					<path class="tooth" {d} />
				{/each}
			</g>
		</g>
		<g class="upper">
			<g class="left">
				{#each upperTeethPaths as d, i}
					<path class="tooth" {d} />
				{/each}
			</g>
			<g class="right" transform="scale(-1, 1)">
				{#each upperTeethPaths as d, i}
					<path class="tooth" {d} />
				{/each}
			</g>
		</g>
	</g>

	<image href="/skull.jpg" x={-size / 1.57} y={-size / 2.05} width={size * 1.25} opacity={0.5} />
	<g id="guide">
		{#each angles as a, i}
			<path d={`M${radialPointString(a, radii[9])}L${radialPointString(a, r)}`} />
			<text
				x={radialPoint(a, r + size / 60).x}
				y={radialPoint(a, r + size / 60).y}
				alignment-baseline="middle"
				text-anchor="middle">{i}</text
			>
		{/each}
		{#each radii as r}
			<circle {r} />
		{/each}
		<path id="pentagram" d={parse('M0 0L24 0L48 0L12 0L36 0Z')} />
		<path d={polygonPath(3, radii[0])} />
		<path d={polygonPath(6, radii[0], { rotate: 30 })} />
		<circle r={cheekRadius} />
		<circle r={upperGumRadius} />
		<circle r={teethCircle.r} cy={teethCircle.y} />
		<circle r={haloCircle.r} />
		<circle r={jawInnerCircle.r} cy={jawInnerCircle.y} />
		<circle r={jawOuterCircle.r} cy={jawOuterCircle.y} />
	</g>
</DopplerSvg>
