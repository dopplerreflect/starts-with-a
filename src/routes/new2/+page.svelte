<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { circleLineIntersections, pointToString as p, viewBox } from '$lib/geometry';
	const size = 2 ** 10;
	const r = size / 6;
	const seedTriangleHeight = Math.sqrt(r ** 2 - (r / 2) ** 2);
	const seedPoints: Point[] = [
		{ x: 0, y: 0 },
		{ x: r, y: 0 },
		{ x: r / 2, y: -seedTriangleHeight },
		{ x: -r / 2, y: -seedTriangleHeight },
		{ x: -r, y: 0 },
		{ x: -r / 2, y: seedTriangleHeight },
		{ x: r / 2, y: seedTriangleHeight }
	];
	const seedVesicaHeight = Math.sqrt((r * 2) ** 2 - r ** 2);
	const seedVesicaWidth = Math.sqrt(seedVesicaHeight ** 2 - seedTriangleHeight ** 2);
	const trianglePoints: Point[] = [
		{ x: 0, y: -seedVesicaHeight },
		{ x: -seedVesicaWidth, y: seedTriangleHeight },
		{ x: seedVesicaWidth, y: seedTriangleHeight },
		{ x: 0, y: seedVesicaHeight },
		{ x: seedVesicaWidth, y: -seedTriangleHeight },
		{ x: -seedVesicaWidth, y: -seedTriangleHeight }
	];
	const triangleLines: Line[] = [
		[trianglePoints[0], trianglePoints[1]],
		[trianglePoints[1], trianglePoints[2]],
		[trianglePoints[2], trianglePoints[0]],
		[trianglePoints[3], trianglePoints[4]],
		[trianglePoints[4], trianglePoints[5]],
		[trianglePoints[5], trianglePoints[3]]
	];
	const circles: Circle[] = seedPoints.map((p) => ({ r, x: p.x, y: p.y }));
	const seed120ChordRadius = Math.sqrt(seedTriangleHeight ** 2 + (r / 2 + r) ** 2);
	const seed120ChordVesicaRadius = Math.sqrt(seed120ChordRadius ** 2 - r ** 2);
	circles.push({ r: seed120ChordRadius, x: seedPoints[1].x, y: seedPoints[1].y });
	circles.push({ r: seed120ChordRadius, x: seedPoints[4].x, y: seedPoints[4].y });
	circles.push({ r: seed120ChordVesicaRadius, x: 0, y: 0 });
	const decagonIntersections: Point[] = triangleLines
		.map((l) => circleLineIntersections(circles[9], l))
		.flat();
</script>

<DopplerSvg id="new2" viewBox={viewBox(size)}>
	<defs>
		<style>
			circle,
			path:not(.Background) {
				stroke: oklch(0.5 0.4 300);
				fill: none;
			}
			.penta path {
				stroke: oklch(0.5 0.4 300);
				stroke-width: 5;
				stroke-linejoin: bevel;
				fill: oklch(0.5 0.4 240 / 0.25);
			}
			.bg path {
				stroke-width: 3;
			}
		</style>
	</defs>
	<Background {size} fill="black" />
	<g class="frame">
		<circle {r} />
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
		{#each triangleLines as l}
			<path d={`M${p(l[0])} ${p(l[1])}`} />
		{/each}
	</g>
	<g class="penta bg">
		<path
			d={`M${p(seedPoints[3])} ${p(decagonIntersections[10])} ${p(decagonIntersections[9])} ${p(
				decagonIntersections[0]
			)} ${p(decagonIntersections[5])}Z`}
		/>
		<path
			d={`M${p(seedPoints[1])} ${p(decagonIntersections[3])} ${p(decagonIntersections[4])} ${p(
				decagonIntersections[7]
			)} ${p(decagonIntersections[8])}Z`}
		/>
		<path
			d={`M${p(seedPoints[5])} ${p(decagonIntersections[6])} ${p(decagonIntersections[11])} ${p(
				decagonIntersections[2]
			)} ${p(decagonIntersections[1])}Z`}
		/>
		<path
			d={`M${p(seedPoints[0])} ${p(seedPoints[3])} ${p(decagonIntersections[5])} ${p(
				decagonIntersections[8]
			)} ${p(seedPoints[1])}Z`}
		/>
		<path
			d={`M${p(seedPoints[0])} ${p(seedPoints[1])} ${p(decagonIntersections[3])} ${p(
				decagonIntersections[6]
			)} ${p(seedPoints[5])}Z`}
		/>
		<path
			d={`M${p(seedPoints[0])} ${p(seedPoints[5])} ${p(decagonIntersections[1])} ${p(
				decagonIntersections[10]
			)} ${p(seedPoints[3])}Z`}
		/>
	</g>
	<g class="penta" transform="rotate(60)">
		<path
			d={`M${p(seedPoints[3])} ${p(decagonIntersections[10])} ${p(decagonIntersections[9])} ${p(
				decagonIntersections[0]
			)} ${p(decagonIntersections[5])}Z`}
		/>
		<path
			d={`M${p(seedPoints[1])} ${p(decagonIntersections[3])} ${p(decagonIntersections[4])} ${p(
				decagonIntersections[7]
			)} ${p(decagonIntersections[8])}Z`}
		/>
		<path
			d={`M${p(seedPoints[5])} ${p(decagonIntersections[6])} ${p(decagonIntersections[11])} ${p(
				decagonIntersections[2]
			)} ${p(decagonIntersections[1])}Z`}
		/>
		<path
			d={`M${p(seedPoints[0])} ${p(seedPoints[3])} ${p(decagonIntersections[5])} ${p(
				decagonIntersections[8]
			)} ${p(seedPoints[1])}Z`}
		/>
		<path
			d={`M${p(seedPoints[0])} ${p(seedPoints[1])} ${p(decagonIntersections[3])} ${p(
				decagonIntersections[6]
			)} ${p(seedPoints[5])}Z`}
		/>
		<path
			d={`M${p(seedPoints[0])} ${p(seedPoints[5])} ${p(decagonIntersections[1])} ${p(
				decagonIntersections[10]
			)} ${p(seedPoints[3])}Z`}
		/>
	</g>
</DopplerSvg>
