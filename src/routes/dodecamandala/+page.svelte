<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import {
		anglesArray,
		circleIntersections,
		circleLineIntersections,
		phylotaxicPoints,
		radialPoint,
		radialPointString,
		viewBox
	} from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';
	const size = 2 ** 10;

	const r0 = size / 5;
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
		r1,
		r0 * 3,
		0
	].sort((a, b) => b - a);

	const parse = pathFromDSL(angles, radii);

	let svg: SVGSVGElement;

	onMount(() => {
		const unmountZoom = useZoomableViewbox(svg, 0);
		const unMountSave = useSaveFile(svg);
		return () => {
			unmountZoom();
			unMountSave();
		};
	});
</script>

<svg viewBox={viewBox(size)} bind:this={svg} id="dodecamandala">
	<defs>
		<style>
			circle,
			path {
				/* stroke: oklch(1 0 0); */
				shape-rendering: 'crispEdges';
				shape-rendering: 'geometricPrecision';
				/* shape-rendering: 'optimizeSpeed'; */
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
				stroke: oklch(0.5 0.37 150);
				/* display: none; */
			}
			.front path {
				stroke: oklch(1 0.37 150);
				/* display: none; */
			}
			#sixth-of-mandala path {
				stroke: oklch(1 0.37 150 / 0.5);
				/* stroke: none; */
			}
			#sixth-of-mandala {
				/* display: none; */
			}
			#guide {
				display: none;
			}
			#dodecahedron {
				/* display: none; */
			}
		</style>
		<radialGradient id="background">
			<stop offset="0%" stop-color="oklch(0.35 0.1 300)" />
			<stop offset="100%" stop-color="oklch(0.1 0.37 300)" />
		</radialGradient>
	</defs>
	<Background {size} fill="url(#background)" />
	<g id="guide" fill="none">
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
	{#each phylotaxicPoints(2 ** 12, Math.sqrt((size / 2) ** 2 * 2)) as p, i}
		<circle cx={p.x} cy={p.y} r={5} stroke={`oklch(0.5 0.3 300)`} />
	{/each}
	<g id="dodecahedron">
		<g class="rear">
			<path
				fill={`oklch(0.2 0.37 150 / 0.2)`}
				id="bottom"
				d={parse('M14 2L16 2L18 2L20 2L17 5Z')}
			/>
			<path
				fill={`oklch(0.3 0.37 150 / 0.2)`}
				id="lower-left"
				d={'M0 0' + parse('L17 5L14 2L12 2L9 5Z')}
			/>
			<path
				fill={`oklch(0.4 0.37 150 / 0.2)`}
				id="lower-right"
				d={'M0 0' + parse('L17 5L20 2L22 2L1 5Z')}
			/>
			<path
				fill={`oklch(0.5 0.37 150 / 0.2)`}
				id="upper-left"
				d={parse('M10 2L12 2L9 5L6 2L8 2Z')}
			/>
			<path
				fill={`oklch(0.6 0.37 150 / 0.2)`}
				id="upper-middle"
				d={'M0 0' + parse('L1 5L4 2L6 2L9 5Z')}
			/>
			<path
				fill={`oklch(0.7 0.37 150 / 0.2)`}
				id="upper-right"
				d={parse('M4 2L2 2L0 2L22 2L1 5Z')}
			/>
		</g>
		<g id="sixth-of-mandala">
			{#each anglesArray(6, 0) as a}
				<g class="sixth" transform={`rotate(${a})`}>
					<path
						fill={`oklch(0.1 0.37 150 / 0.25)`}
						d={parse('M0 9A8 8 0 0 0 3 8A8 8 0 0 0 0 9Z')}
					/>
					<path
						fill={`oklch(0.2 0.37 150 / 0.25)`}
						d={parse('M0 9A8 8 0 0 0 7 8A8 8 0 0 1 5 5Z')}
					/>
					<path
						fill={`oklch(0.3 0.38 150 / 0.25)`}
						d={parse('M0 9A8 8 0 0 1 3 8A8 8 0 0 0 5 5Z')}
					/>
					<path
						fill={`oklch(0.2 0.38 150 / 0.25)`}
						d={parse('M3 8A8 8 0 0 0 5 5A4 4 0 0 1 3 6Z')}
					/>
					<path
						fill={`oklch(0.3 0.38 150 / 0.25)`}
						d={parse('M3 8A8 8 0 0 1 1 5A4 4 0 0 0 3 6Z')}
					/>
					<path
						fill={`oklch(0.1 0.38 150 / 0.25)`}
						d={parse('M3 6A5 5 0 0 0 5 5A5 5 0 0 1 1 5A5 5 0 0 0 3 6Z')}
					/>
					<path
						fill={`oklch(0.3 0.38 150 / 0.25)`}
						d={parse('M5 5A5 5 0 0 1 3 3A5 5 0 0 1 1 5A5 5 0 0 0 5 5Z')}
					/>
				</g>
			{/each}
		</g>
		<g class="front">
			<path fill={`oklch(1 0.37 150 / 0.2)`} id="top" d={parse('M8 2L6 2L4 2L2 2L5 5Z')} />
			<path
				fill={`oklch(0.7 0.37 150 / 0.2)`}
				id="upper-left"
				d={'M0 0' + parse('L5 5L8 2L10 2L13 5Z')}
			/>
			<path
				fill={`oklch(0.8 0.37 150 / 0.2)`}
				id="upper-right"
				d={'M0 0' + parse('L5 5L2 2L0 2L21 5Z')}
			/>
			<path
				fill={`oklch(0.4 0.37 150 / 0.2)`}
				id="lower-left"
				d={parse('M10 2L12 2L14 2L16 2L13 5Z')}
			/>
			<path
				fill={`oklch(0.5 0.37 150 / 0.2)`}
				id="lower-middle"
				d={'M0 0' + parse('L13 5L16 2L18 2L21 5Z')}
			/>
			<path
				fill={`oklch(0.6 0.37 150 / 0.2)`}
				id="lower-right"
				d={parse('M18 2L20 2L22 2L0 2L21 5Z')}
			/>
		</g>
	</g>
</svg>
