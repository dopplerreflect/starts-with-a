<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		circleLineIntersections,
		intersection,
		midpoint,
		phi,
		pointToString,
		radialPoint
	} from '$lib/geometry';

	const size = 2 ** 10;

	const ro = size / 3.37;
	const radii = [ro * phi, ro * phi ** 2];
	const angles = anglesArray(6, 0);
	const circles: Circle[] = angles
		.map((a) => radii.map((r) => ({ r, ...radialPoint(a, ro) })))
		.flat();
	const ol: Line[] = angles.map((a, i) => [
		radialPoint(a, ro + radii[0]),
		radialPoint(angles[(i + 1) % 6], ro + radii[0])
	]);
	const rl: Line[] = angles.map((a, i) => [radialPoint(a, ro + radii[0]), { x: 0, y: 0 }]);
	const sll: Line[] = angles.map((_, i) => [
		circleLineIntersections(circles[(i * 2) % 12], ol[i])[0],
		circleLineIntersections(circles[(i * 2 + 6) % 12], ol[(i + 2) % 6])[0]
	]);
	const slr: Line[] = angles.map((a, i) => [
		circleLineIntersections(circles[(i * 2) % 12], ol[i])[0],
		circleLineIntersections(circles[(i * 2 + 8) % 12], ol[(i + 3) % 6])[0]
	]);
	const tll: Line[] = angles.map((a, i) => [radialPoint(a, ro), sll[(i + 1) % 6][1]]);
	const tlr: Line[] = angles.map((a, i) => [radialPoint(a, ro), sll[(i + 2) % 6][0]]);
	const bigStarPath = [
		'M',
		pointToString(intersection(slr[1], tll[1])),
		pointToString(intersection(tll[1], tll[5])),
		pointToString(intersection(tll[5], sll[4])),
		pointToString(intersection(sll[4], sll[2])),
		'Z',
		'M',
		pointToString(intersection(tlr[5], sll[3])),
		pointToString(intersection(sll[3], slr[2])),
		pointToString(intersection(slr[2], tlr[5])),
		'Z',
		'M',
		pointToString(intersection(slr[2], tll[1])),
		pointToString(intersection(tll[1], tlr[1])),
		pointToString(intersection(tlr[1], slr[2])),
		'Z',
		'M',
		pointToString(intersection(tll[3], slr[2])),
		pointToString(intersection(slr[2], sll[2])),
		pointToString(intersection(sll[2], tll[3])),
		'Z',
		'M',
		pointToString(intersection(tlr[3], tlr[1])),
		pointToString(intersection(tlr[1], sll[3])),
		pointToString(intersection(sll[3], sll[1])),
		pointToString(intersection(sll[1], tlr[3])),
		'Z'
	].join(' ');
	const smallStarPath = [
		'M',
		pointToString(intersection(rl[4], tlr[2])),
		pointToString(intersection(tlr[2], tlr[4])),
		pointToString(intersection(tlr[4], rl[4])),
		pointToString(intersection(rl[4], rl[0])),
		pointToString(intersection(rl[0], tll[0])),
		pointToString(intersection(tll[0], tll[2])),
		pointToString(intersection(tll[2], tlr[4])),
		pointToString(intersection(tlr[4], slr[0])),
		pointToString(intersection(slr[0], tll[0])),
		'Z'
	].join(' ');
</script>

<DopplerSvg {size} id="great-stellated-dodecahedron">
	<defs>
		<filter id="glow">
			<feMorphology in="SourceGraphic" operator="dilate" radius="1.5" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="3" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<linearGradient id="lGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="oklch(0.4 0.37 0)" />
			<stop offset="100%" stop-color="oklch(0.0 0.37 240)" />
		</linearGradient>
		<style>
			circle {
				fill: none;
			}
			circle,
			line {
				stroke: white;
				filter: url(#glow);
			}
			text {
				display: none;
				fill: yellow;
				alignment-baseline: middle;
				text-anchor: middle;
			}
			line.rl,
			line.ol {
				display: none;
			}
			#bigStarPath {
				stroke: none;
			}
			#smallStarPath {
				stroke: none;
			}
		</style>
		<path id="bigStarPath" d={bigStarPath} />
		<path id="smallStarPath" d={smallStarPath} />
	</defs>
	<Background {size} fill="url(#lGradient)" />
	<g id="guide">
		{#each circles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} id={`c${i}`} />
		{/each}
		{#each rl as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} class="rl" />
			<text x={midpoint(l).x} y={midpoint(l).y}>{`rl${i}`}</text>
		{/each}
		{#each ol as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} class="ol" />
			<text x={midpoint(l).x} y={midpoint(l).y}>{`ol${i}`}</text>
		{/each}
		{#each sll as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} class="sll" />
			<text x={midpoint(l).x} y={midpoint(l).y}>{`sll${i}`}</text>
		{/each}
		{#each slr as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} class="slr" />
			<text x={midpoint(l).x} y={midpoint(l).y}>{`slr${i}`}</text>
		{/each}
		{#each tll as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} class="tll" />
			<text x={midpoint(l).x} y={midpoint(l).y}>{`tll${i}`}</text>
		{/each}
		{#each tlr as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} class="tlr" />
			<text x={midpoint(l).x} y={midpoint(l).y}>{`tlr${i}`}</text>
		{/each}
	</g>
	{#each anglesArray(3, 0) as a, i}
		<use href="#bigStarPath" transform={`rotate(${a})`} fill={`oklch(1.0 0.37 ${a} / 0.66)`} />
	{/each}
	{#each anglesArray(3, 0) as a, i}
		<use
			href="#smallStarPath"
			transform={`rotate(${a})`}
			fill={`oklch(1.0 0.37 ${a + 180} / 0.66)`}
		/>
	{/each}
</DopplerSvg>
