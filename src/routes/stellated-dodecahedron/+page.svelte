<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import {
		anglesArray,
		arrayMap,
		circleIntersections,
		circleLineIntersections,
		intersection,
		polygonPath,
		radialPoint,
		radialPointString,
		viewBox
	} from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';
	let svg: SVGSVGElement;
	onMount(() => {
		const unmountZoom = useZoomableViewbox(svg);
		const unMountSave = useSaveFile(svg, { timestamp: true });
		return () => {
			unmountZoom();
			unMountSave();
		};
	});
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
					// { r: radii[2], ...radialPoint(a, radii[2]) },
					{ r: setupRadii[3], ...radialPoint(a, setupRadii[2]) },
					{ r: setupRadii[4], ...radialPoint(a, setupRadii[2]) },
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
			setupRadii[4] + setupRadii[2],
			hexintersectRadius,
			trilineIntersectRadius
		].sort((a, b) => b - a),
		smallHexline: Line = [
			radialPoint(anglesWithPhi[6], radii[1]),
			radialPoint(anglesWithPhi[2], radii[1])
		],
		pentaLine: Line = [
			radialPoint(anglesWithPhi[4], radii[1]),
			radialPoint(anglesWithPhi[1], radii[5])
		],
		hexPentaIntersection = intersection(smallHexline, pentaLine),
		hexaPentaRadius = Math.sqrt(hexPentaIntersection.x ** 2 + hexPentaIntersection.y ** 2);
	radii.push(hexaPentaRadius);
	radii.sort((a, b) => b - a);
	const hexPentAngle = Math.abs(
			Math.atan2(hexPentaIntersection.y, hexPentaIntersection.x) * (180 / Math.PI)
		),
		hexPentAngles = [...Array(6).keys()]
			.map((n) => [(60 * n + hexPentAngle) % 360, (60 * n - hexPentAngle + 180) % 360])
			.flat(),
		angles = [...anglesWithPhi, ...hexPentAngles].sort((a, b) => b - a);

	const parse = pathFromDSL(angles, radii);
</script>

<svg viewBox={viewBox(size)} bind:this={svg} id="stellated-dodecahedron">
	<defs>
		<style>
			:root {
				--radiiGuideColor: oklch(0.66 0.37 150);
			}
			circle,
			path {
				fill: none;
			}
			#radii circle,
			#radii path {
				stroke: var(--radiiGuideColor);
			}
			#radii text {
				fill: var(--radiiGuideColor);
			}
			#circles {
				stroke: oklch(0.5 0.37 120);
			}
			#bigPenta path {
				stroke: oklch(1 0.37 60);
				stroke-width: 3;
				fill: oklch(0.5 0.37 60 / 0.25);
			}
		</style>
	</defs>
	<Background {size} fill="black" />
	<!-- <path d={`M${smallHexline[0].x} ${smallHexline[0].y}H${smallHexline[1].x}`} stroke="white" />
	<path
		d={`M${pentaLine[0].x} ${pentaLine[0].y}L${pentaLine[1].x} ${pentaLine[1].y}`}
		stroke="white"
	/> -->
	<g id="radii">
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
	</g>
	<g id="circles">
		{#each circles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
	</g>
	<path id="hexagon" d={polygonPath(6, setupRadii[0])} stroke={`oklch(1 0.37 270)`} />
	{#each angles as a, i}
		<path d={`M0 0L${radialPointString(a, setupRadii[0])}`} stroke="white" />
		<text
			fill="white"
			x={radialPoint(a, setupRadii[0] + size / 60).x}
			y={radialPoint(a, setupRadii[0] + size / 60).y}
			text-anchor="middle"
			alignment-baseline="middle">{i}</text
		>
	{/each}
	{#each anglesArray(3, 0) as a}
		<g id="bigPenta" transform={`rotate(${a})`}>
			<!-- <path
				class="outer"
				d={parse('M4 10L4 7L7 4L4 5L4 1L2 4L0 1L0 5L27 4L0 7Z')}
				stroke={`oklch(1 0.37 60)`}
			/> -->
			<g class="edges">
				<path d={parse('M7 10L4 7L7 4Z')} />
				<path d={parse('M7 4L4 5 L4 1Z')} />
				<path d={parse('M4 1L2 4L0 1Z')} />
				<path d={parse('M0 1L0 5L27 4Z')} />
				<path d={parse('M27 4L0 7L27 10Z')} />
			</g>
			<g class="starInner">
				<path d={parse('M2 5L2 10L4 7Z')} />
				<path d={parse('M2 5L7 4L4 7Z')} />
				<path d={parse('M2 5L7 4L4 5Z')} />
				<path d={parse('M2 5L4 5L4 1Z')} />
				<path d={parse('M2 5L4 1L2 4Z')} />
				<path d={parse('M2 5L2 4L0 1Z')} />
				<path d={parse('M2 5L0 1L0 5Z')} />
				<path d={parse('M2 5L0 5L27 4Z')} />
				<path d={parse('M2 5L27 4L0 7Z')} />
				<path d={parse('M2 5L0 7L0 10Z')} />
			</g>
		</g>
		<g class="medPenta">
			<g class="starInner">
				<path d={parse('M4 3L4 1L')} />
			</g>
		</g>
	{/each}
</svg>
