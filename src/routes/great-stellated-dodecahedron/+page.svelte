<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		anglesArray,
		circleLineIntersections,
		phi,
		radialPoint,
		pathFromIntersectionsOfLines
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
	const bigStarPath = pathFromIntersectionsOfLines([
		'M',
		slr[1],
		tll[1],
		tll[5],
		sll[4],
		sll[2],
		'Z',
		'M',
		tlr[5],
		sll[3],
		slr[2],
		tlr[5],
		'Z',
		'M',
		slr[2],
		tll[1],
		tlr[1],
		slr[2],
		'Z',
		'M',
		tll[3],
		slr[2],
		sll[2],
		tll[3],
		'Z',
		'M',
		tlr[3],
		tlr[1],
		sll[3],
		sll[1],
		tlr[3],
		'Z'
	]);
	const smallStarPath = pathFromIntersectionsOfLines([
		'M',
		rl[4],
		tlr[2],
		tlr[4],
		rl[4],
		rl[0],
		tll[0],
		tll[2],
		tlr[4],
		slr[0],
		tll[0],
		'Z'
	]);
</script>

<DopplerSvg {size} id="great-stellated-dodecahedron">
	<defs>
		<filter id="glow">
			<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
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
			#guide {
				stroke: white;
				fill: none;
				filter: url(#glow);
				/* display: none; */
			}
		</style>
	</defs>
	<Background {size} fill="url(#lGradient)" />
	<g id="guide">
		{#each circles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} id={`c${i}`} />
		{/each}
		<LineWithLegend lineArray={rl} name="rl" />
		<LineWithLegend lineArray={ol} name="ol" />
		<LineWithLegend lineArray={sll} name="sll" />
		<LineWithLegend lineArray={slr} name="slr" />
		<LineWithLegend lineArray={tll} name="tll" />
		<LineWithLegend lineArray={tlr} name="tlr" />
	</g>
	{#each anglesArray(3, 0) as a, i}
		<path d={bigStarPath} transform={`rotate(${a})`} fill={`oklch(1.0 0.37 ${a} / 0.66)`} />
	{/each}
	{#each anglesArray(3, 0) as a, i}
		<path d={smallStarPath} transform={`rotate(${a})`} fill={`oklch(1.0 0.37 ${a + 180} / 0.66)`} />
	{/each}
</DopplerSvg>
