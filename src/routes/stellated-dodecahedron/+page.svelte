<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DrLogo from '$lib/components/DRLogo.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		circleIntersections,
		circleLineIntersections,
		intersection,
		polygonPath,
		radialPoint,
		radialPointString,
		viewBox
	} from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';
	const size = 2 ** 10,
		r0 = size / 7,
		r1 = r0 * 2,
		angles6 = anglesArray(6, 30),
		setupCircles: Circle[] = [...angles6.map((a) => [{ r: r1, ...radialPoint(a, r0) }]).flat()],
		setupRadii = [
			...new Set(
				[
					circleIntersections(setupCircles[0], setupCircles[1]),
					circleIntersections(setupCircles[0], setupCircles[3])[0]
				]
					.flat()
					.map((p) => Math.sqrt(p.x ** 2 + p.y ** 2))
			),
			0
		].sort((a, b) => b - a);
	setupRadii.push(setupRadii[1] - setupRadii[2]);
	setupRadii.sort((a, b) => b - a);
	setupRadii.push(setupRadii[2] - setupRadii[3]);
	setupRadii.sort((a, b) => b - a);
	const circles: Circle[] = [
			...angles6
				.map((a) => [
					{ r: setupRadii[1], ...radialPoint(a, setupRadii[2]) },
					{ r: setupRadii[3], ...radialPoint(a, setupRadii[2]) },
					{ r: setupRadii[4], ...radialPoint(a, setupRadii[2]) },
					{ r: setupRadii[0], ...radialPoint(a, setupRadii[1]) },
					{ r: setupRadii[3], ...radialPoint(a, setupRadii[1]) }
				])
				.flat()
		],
		hexline: Line = [
			radialPoint(angles6[0], setupRadii[0]),
			radialPoint(angles6[1], setupRadii[0])
		],
		hexintersect = circleLineIntersections(circles[0], hexline)[1],
		hexangle = Math.abs(Math.atan2(hexintersect.y, hexintersect.x) * (180 / Math.PI)),
		phiAngles = [...Array(6).keys()]
			.map((n) => [(60 * n + hexangle) % 360, (60 * n - hexangle + 180) % 360])
			.flat(),
		anglesWithPhi = [...angles6, ...phiAngles].sort((a, b) => b - a),
		hexintersectRadius = Math.sqrt(hexintersect.x ** 2 + hexintersect.y ** 2),
		triline: Line = [
			radialPoint(anglesWithPhi[4], setupRadii[1]),
			radialPoint(anglesWithPhi[16], setupRadii[1])
		],
		trilineIntersect = circleLineIntersections(circles[22], triline)[0],
		trilineIntersectRadius = Math.sqrt(trilineIntersect.x ** 2 + trilineIntersect.y ** 2),
		radii = [
			...setupRadii,
			setupRadii[1] + setupRadii[3],
			hexintersectRadius,
			trilineIntersectRadius
		].sort((a, b) => b - a),
		smallHexline: Line = [
			radialPoint(anglesWithPhi[6], radii[1]),
			radialPoint(anglesWithPhi[2], radii[1])
		],
		largeHexLine: Line = [
			radialPoint(anglesWithPhi[3], radii[1]),
			radialPoint(anglesWithPhi[8], radii[1])
		],
		hexesIntersection = intersection(smallHexline, largeHexLine),
		hexesIntersectionRadius = Math.sqrt(hexesIntersection.x ** 2 + hexesIntersection.y ** 2),
		largeHexIntersection = intersection(largeHexLine, [
			{ x: 0, y: 0 },
			radialPoint(anglesWithPhi[6], radii[0])
		]),
		largeHexIntersectionRadius = Math.sqrt(
			largeHexIntersection.x ** 2 + largeHexIntersection.y ** 2
		),
		line42: Line = [
			radialPoint(anglesWithPhi[4], radii[2]),
			radialPoint(anglesWithPhi[2], radii[1])
		],
		line42Intersection = intersection(line42, largeHexLine),
		line42IntersectionRadius = Math.sqrt(line42Intersection.x ** 2 + line42Intersection.y ** 2),
		line20: Line = [
			radialPoint(anglesWithPhi[2], radii[1]),
			radialPoint(anglesWithPhi[0], radii[1])
		],
		line20Intersection = intersection(line20, [
			{ x: 0, y: 0 },
			radialPoint(anglesWithPhi[1], radii[3])
		]),
		line20IntersectionRadius = Math.sqrt(line20Intersection.x ** 2 + line20Intersection.y ** 2);

	radii.push(hexesIntersectionRadius);
	radii.push(largeHexIntersectionRadius);
	radii.push(line42IntersectionRadius);
	radii.push(line20IntersectionRadius);
	radii.sort((a, b) => b - a);

	const hexPentAngle = Math.abs(
			Math.atan2(hexesIntersection.y, hexesIntersection.x) * (180 / Math.PI)
		),
		hexPentAngles = [...Array(6).keys()]
			.map((n) => [(60 * n + hexPentAngle) % 360, (60 * n - hexPentAngle + 180) % 360])
			.flat(),
		line42IntersectionAngle = Math.abs(
			Math.atan2(line42Intersection.y, line42Intersection.x) * (180 / Math.PI)
		),
		line42Angles = [...Array(6).keys()]
			.map((n) => [
				(60 * n + line42IntersectionAngle) % 360,
				(60 * n - line42IntersectionAngle + 180) % 360
			])
			.flat(),
		angles = [...anglesWithPhi, ...hexPentAngles, ...line42Angles].sort((a, b) => b - a);

	const parse = pathFromDSL(angles, radii);
</script>

<DopplerSvg viewBox={viewBox(size)} id="stellated-dodecahedron">
	<defs>
		<style>
			:root {
				--guideColor: oklch(0.75 0.37 90);
			}
			#guide circle,
			#guide path {
				fill: none;
				stroke: var(--guideColor);
			}
			#guide text {
				fill: var(--guideColor);
			}
			.bigPenta path,
			.medPenta path,
			.tinyPenta path {
				stroke: oklch(0.1 0.37 90);
				stroke-width: 3;
				fill: oklch(1 0.37 90 / 0.75);
			}
			.edges path {
				fill: oklch(0.5 0.37 90/ 0.75);
			}
			#guide {
				/* display: none; */
			}
			.third {
				/* display: none; */
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.075 0.2 240)" />
	<g id="guide">
		<!-- <path d={`M${smallHexline[0].x} ${smallHexline[0].y}H${smallHexline[1].x}`} />
		<path d={`M${triline[0].x} ${triline[0].y}L${triline[1].x} ${triline[1].y}`} />
		<path
			d={`M${largeHexLine[0].x} ${largeHexLine[0].y}L${largeHexLine[1].x} ${largeHexLine[1].y}`}
		/>
		<path d={`M${line42[0].x} ${line42[0].y}L${line42[1].x} ${line42[1].y}`} />
		<circle cx={largeHexIntersection.x} cy={largeHexIntersection.y} r={10} />
		<circle cx={line42Intersection.x} cy={line42Intersection.y} r={10} /> -->
		<!-- <g id="radii">
			{#each radii as r, i}
				<circle {r} />
				<text
					font-size={size / 75}
					x={-size / 2 + size / 75}
					y={-r}
					alignment-baseline="middle"
					text-anchor="middle">{i}</text
				>
				<path d={`M${-size / 2 + (size / 75) * 2} ${-r}H0`} />
			{/each}
		</g> -->
		<g id="circles">
			{#each circles as c, i}
				<circle r={c.r} cx={c.x} cy={c.y} />
			{/each}
		</g>
		<!-- <path id="hexagon" d={polygonPath(6, setupRadii[0])} /> -->
		{#each anglesWithPhi as a, i}
			<path d={`M0 0L${radialPointString(a, setupRadii[0])}`} />
			<text
				fill="white"
				x={radialPoint(a, setupRadii[0] + size / 60).x}
				y={radialPoint(a, setupRadii[0] + size / 60).y}
				text-anchor="middle"
				alignment-baseline="middle">{i}</text
			>
		{/each}
	</g>
	<!-- <g id="background">
		{#each angles as a, i}
			<path
				d={`M${radialPointString(a, radii[11])}L${radialPointString(a, (size / 2) * Math.sqrt(2))}`}
				stroke="oklch(0.5 0.37 90)"
				stroke-width={9}
			/>
			<path
				d={`M${radialPointString(a, radii[11])}L${radialPointString(a, (size / 2) * Math.sqrt(2))}`}
				stroke="oklch(1 0.37 90)"
				stroke-width={3}
			/>
		{/each}
	</g> -->
	<g id="whole">
		{#each anglesArray(3, 0) as a}
			<g class="third" transform={`rotate(${a})`}>
				<g class="bigPenta">
					<g class="edges">
						<path d={parse('M10 12L6 9L10 6Z')} />
						<path d={parse('M10 6L6 7L6 1Z')} />
						<path d={parse('M6 1L3 6L0 1Z')} />
						<path d={parse('M0 1L0 7L38 6Z')} />
						<path d={parse('M38 6L0 9L38 12Z')} />
					</g>
					<g class="starInner">
						<path d={parse('M3 7L3 12L6 9Z')} />
						<path d={parse('M3 7L6 9L10 6Z')} />
						<path d={parse('M3 7L10 6L6 7Z')} />
						<path d={parse('M3 7L6 7L6 1Z')} />
						<path d={parse('M3 7L6 1L3 6Z')} />
						<path d={parse('M3 7L3 6L0 1Z')} />
						<path d={parse('M3 7L0 1L0 7Z')} />
						<path d={parse('M3 7L0 7L38 6Z')} />
						<path d={parse('M3 7L38 6L0 9Z')} />
						<path d={parse('M3 7L0 9L0 12Z')} />
					</g>
				</g>
				<g class="medPenta">
					<g class="edges">
						<path d={parse('M10 6L9 5L6 1Z')} />
						<path d={parse('M8 3L7 1L6 1Z')} />
						<path d={parse('M38 6L39 5L0 1Z')} />
						<path d={parse('M0 1L41 1L40 3Z')} />
					</g>
					<g class="starInner">
						<path d={parse('M10 2L10 6L9 5Z')} />
						<path d={parse('M10 2L9 5L6 1Z')} />
						<path d={parse('M10 2L7 1L8 3Z')} />
						<path d={parse('M38 2L38 6L39 5Z')} />
						<path d={parse('M38 2L39 5L0 1Z')} />
						<path d={parse('M38 2L41 1L40 3Z')} />
					</g>
				</g>
				<g class="tinyPenta">
					<path d={parse('M6 1L3 2L3 4Z')} />
					<path d={parse('M0 1L3 2L3 4Z')} />
				</g>
			</g>
		{/each}
	</g>
	<DrLogo
		size={size / 16}
		transform={`translate(${size / 2 - size / 16} ${size / 2 - size / 16})`}
	/>
</DopplerSvg>
