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
		teethRadius = radii[0] + radii[2] - radii[4];

	const parse2 = pathFromDSL(angles, [teethRadius, cheekRadius, ...radii]);

	const jawInnerCircle: Circle = { r: radii[2], x: 0, y: radii[1] + radii[11] };
	const jawOuterCircle: Circle = { r: radii[1], x: 0, y: radii[0] + radii[10] };
	const haloCircle: Circle = { r: radii[0] * Phi, x: 0, y: 0 };
	const skullCircle: Circle = { r: radii[0], x: 0, y: 0 };

	const jawPoints = circleIntersections(haloCircle, jawOuterCircle);
	const jawSkullIntersections = circleIntersections(skullCircle, jawInnerCircle);

	const biteCircle: Circle = { r: radii[0] - radii[11], x: 0, y: radii[3] - radii[11] };

	const biteCircleAngles = [
		...new Set([...Array(7).keys()].map((k, i) => [90 + (8 - k / 2) * k]).flat())
	];

	const biteCircleLines: Line[] = biteCircleAngles.map((a) => [
		{ x: biteCircle.x, y: biteCircle.y },
		radialPoint(a, biteCircle.r + 1, { center: { x: 0, y: biteCircle.y } })
	]);

	const biteCircleIntersections: Point[] = biteCircleLines
		.map((l, i) => circleLineIntersections(biteCircle, l)[0])
		.sort((a, b) => a.x - b.x);

	const toothPaths = biteCircleIntersections
		.slice(0, biteCircleIntersections.length - 1)
		.map((t, n) => {
			const i = biteCircleIntersections;
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
</script>

<DopplerSvg zoom={0} yPan={0} viewBox={`${-size / 2} ${-size / 3} ${size} ${size}`} id="skull">
	<defs>
		<style>
			ellipse,
			circle,
			path:not(.Background) {
				fill: none;
				stroke: black;
				stroke-width: 2;
			}
			ellipse {
				fill: white;
			}
			path.black,
			.black {
				fill: black;
				fill-opacity: 0.5;
			}
			path#skull,
			path#jaw,
			path.tooth {
				fill: oklch(0.9 0.18 280 / 0.5);
			}
			#guide {
				/* display: none; */
			}
			path.red {
				stroke: red;
			}
			path.tooth {
				/* fill: white; */
			}
		</style>
	</defs>
	<Background width={size} height={size * 1.3} fill="white" />
	<!-- <image href="/skull.jpg" x={-size / 1.57} y={-size / 2.05} width={size * 1.25} /> -->

	<g id="guide">
		{#each angles as a, i}
			<path d={`M${radialPointString(a, radii[1])}L${radialPointString(a, r)}`} />
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
		<circle r={cheekRadius} />
		<circle r={teethRadius} />
		<!-- <circle r={biteCircle.r} cy={biteCircle.y} /> -->
		<circle r={haloCircle.r} />
		<circle r={jawInnerCircle.r} cy={jawInnerCircle.y} />
		<circle r={jawOuterCircle.r} cy={jawOuterCircle.y} />

		<g id="biteCircleLines">
			{#each biteCircleLines as l}
				<path d={`M${pointToString(l[1])}L${pointToString(l[0])}`} />
			{/each}
		</g>
		<g id="biteCircleLines" transform="scale(-1, 1)">
			{#each biteCircleLines as l}
				<path d={`M${pointToString(l[1])}L${pointToString(l[0])}`} />
			{/each}
		</g>
	</g>

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

	<path id="leftTemple" d={parse(`M48 0C47 2 41 0 40 0`)} />
	<path id="rightTemple" d={parse(`M12 0C13 2 19 0 20 0`)} />

	<path
		id="skull"
		d={parse2(
			'M40 2Q40 1 39 1A1 1 0 0 0 37 1C36 1 37 2 36 2' +
				'A2 2 0 0 0 35 2Q34 2 34 0' +
				'A0 0 0 0 0 26 0' +
				'Q26 2 25 2' +
				'A2 2 0 0 0 24 2' +
				'C23 2 24 1 23 1' +
				'A1 1 0 0 0 21 1' +
				'Q20 1 20 2' +
				'A2 2 1 1 0 40 2'
		)}
	/>

	<path
		id="jaw"
		d={`M${radialPointString(angles[37], cheekRadius)}Q${radialPointString(
			angles[36],
			cheekRadius
		)} ${pointToString(jawPoints[1])}A${jawOuterCircle.r} ${jawOuterCircle.r} 0 0 0 ${pointToString(
			jawPoints[0]
		)}Q${radialPointString(angles[24], cheekRadius)} ${radialPointString(
			angles[23],
			cheekRadius
		)}C${radialPointString(angles[24], cheekRadius)} ${radialPointString(
			angles[23],
			radii[0]
		)} ${pointToString(jawSkullIntersections[0])}A${jawInnerCircle.r} ${
			jawInnerCircle.r
		} 0 1 1 ${pointToString(jawSkullIntersections[1])}C${radialPointString(
			angles[37],
			radii[0]
		)} ${radialPointString(angles[36], cheekRadius)} ${radialPointString(
			angles[37],
			cheekRadius
		)}Z`}
	/>

	<g id="upperLeftTeeth">
		{#each toothPaths as d, i}
			<path class="tooth" {d} />
		{/each}
	</g>
	<g id="upperRightTeeth" transform="scale(-1, 1)">
		{#each toothPaths as d, i}
			<path class="tooth" {d} />
		{/each}
	</g>
</DopplerSvg>
