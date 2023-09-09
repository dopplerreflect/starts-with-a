<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		circleIntersections,
		circleLineIntersections,
		midpoint,
		phi,
		radialPoint
	} from '$lib/geometry';

	const size = 2 ** 10;

	const ro = size / 4.1;
	const radii = [ro, ro * phi, ro * phi ** 2];
	const angles = anglesArray(6, 0);
	const circles: Circle[] = angles
		.map((a) => radii.map((r) => ({ r, ...radialPoint(a, ro) })))
		.flat();
	const ol: Line[] = angles.map((a, i) => [
		radialPoint(a, radii[0] + radii[1]),
		radialPoint(angles[(i + 1) % 6], radii[0] + radii[1])
	]);
	const rl: Line[] = angles.map((a, i) => [radialPoint(a, ro * 2), { x: 0, y: 0 }]);
	const sll: Line[] = angles.map((a, i) => [
		circleLineIntersections(circles[(i * 3 + 1) % 18], ol[i])[0],
		circleLineIntersections(circles[(i * 3 + 10) % 18], ol[(i + 2) % 6])[0]
	]);
	const slr: Line[] = angles.map((a, i) => [
		circleLineIntersections(circles[(i * 3 + 1) % 18], ol[i])[0],
		circleLineIntersections(circles[(i * 3 + 13) % 18], ol[(i + 3) % 6])[0]
	]);
	const tll: Line[] = angles.map((a, i) => [
		radialPoint(a, ro),
		radialPoint(angles[(i + 5) % 6], radii[2])
	]);
	const tlr: Line[] = angles.map((a, i) => [
		radialPoint(a, ro),
		radialPoint(angles[(i + 1) % 6], radii[2])
	]);
</script>

<DopplerSvg {size} id="great-stellated-dodecahedron">
	<Background {size} fill="black" />
	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} id={`c${i}`} />
	{/each}
	{#each ol as l, i}
		<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		<text x={midpoint(l).x} y={midpoint(l).y}>{`ol${i}`}</text>
	{/each}
	{#each rl as l, i}
		<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		<text x={midpoint(l).x} y={midpoint(l).y}>{`rl${i}`}</text>
	{/each}
	{#each sll as l, i}
		<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		<text x={midpoint(l).x} y={midpoint(l).y}>{`sll${i}`}</text>
	{/each}
	{#each slr as l, i}
		<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		<text x={midpoint(l).x} y={midpoint(l).y}>{`slr${i}`}</text>
	{/each}
	{#each tll as l, i}
		<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		<text x={midpoint(l).x} y={midpoint(l).y}>{`tll${i}`}</text>
	{/each}
	{#each tlr as l, i}
		<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		<text x={midpoint(l).x} y={midpoint(l).y}>{`tlr${i}`}</text>
	{/each}
</DopplerSvg>

<style>
	circle,
	path:not(.Background) {
		fill: none;
		stroke: grey;
	}
	line {
		stroke: grey;
	}
	text {
		/* display: none; */
		fill: yellow;
		alignment-baseline: middle;
		text-anchor: middle;
	}
</style>
