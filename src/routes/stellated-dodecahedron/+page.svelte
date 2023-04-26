<svelte:options namespace="svg" />

<script lang="ts">
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
	const size = 2 ** 10,
		r0 = size / 7,
		r1 = r0 * 2,
		angles6 = anglesArray(6),
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
		hexangle = Math.atan2(hexintersect.y, hexintersect.x) * (180 / Math.PI),
		angles = arrayMap(6, (n) => 60 * n)
			.map((n) => [n + 30, n + hexangle, n - hexangle])
			.flat()
			.sort((a, b) => a - b),
		radii = [...setupRadii, setupRadii[1] + setupRadii[3], setupRadii[4] + setupRadii[2]].sort(
			(a, b) => b - a
		);
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<style>
			:root {
				--radiiGuideColor: oklch(1 0.37 150);
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
				stroke: oklch(1 0.37 90);
			}
		</style>
	</defs>
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
	{/each}
</svg>
