<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		circleIntersections,
		circleLineIntersections,
		intersection,
		multiCircleIntersections,
		pentagram,
		phi,
		polygonPath,
		viewBox
	} from '$lib/geometry';
	function intersectionClick(i: number) {
		console.log(i);
	}
	const size = 2 ** 10;
	const r = size / 12;
	const circles: Circle[] = [
		{ r, x: 0, y: 0 },
		{ r, x: r, y: 0 },
		{ r, x: -r, y: 0 },
		{ r: r * 2, x: r, y: 0 },
		{ r: r * 2, x: -r, y: 0 }
	];
	const vesicaInterections: Point[] = [
		...circleIntersections(circles[0], circles[1]),
		...circleIntersections(circles[0], circles[2])
	];
	vesicaInterections.forEach((i) => {
		circles.push({ r: r * 2, x: i.x, y: i.y });
	});
	const goldenIntersections: Point[] = [
		circleIntersections(circles[3], circles[4])[1],
		...circleIntersections(circles[5], circles[8])
	];
	const goldenRadii = goldenIntersections.map((i) => Math.abs(i.y));
	goldenRadii.forEach((r) => circles.push({ r, x: 0, y: 0 }));
	const vesicaLine: Line = [
		{ x: -size / 2, y: vesicaInterections[0].y },
		{ x: size / 2, y: vesicaInterections[0].y }
	];
	const pentaSections: Point[] = circleLineIntersections(circles[circles.length - 1], vesicaLine);
	const pentaRadius = Math.sqrt(
		(goldenRadii[2] - -vesicaInterections[0].y) ** 2 + pentaSections[1].x ** 2
	);
	pentaSections.forEach((p) => circles.push({ r: pentaRadius, x: p.x, y: p.y }));
	circles.push({ r: pentaRadius, x: 0, y: goldenRadii[1] });
	const intersections = multiCircleIntersections(circles);
	const lines = [
		[intersections[148], intersections[150]],
		[intersections[150], intersections[149]],
		[intersections[149], intersections[146]],
		[intersections[146], intersections[151]],
		[intersections[151], intersections[148]],
		[intersections[148], intersections[149]],
		[intersections[149], intersections[151]],
		[intersections[151], intersections[150]],
		[intersections[150], intersections[146]],
		[intersections[146], intersections[148]],

		[intersections[148], intersections[98]],
		[intersections[98], intersections[113]],
		[intersections[113], intersections[125]],
		[intersections[125], intersections[124]],
		[intersections[124], intersections[135]],
		[intersections[135], intersections[148]],

		[intersections[148], intersections[113]],
		[intersections[113], intersections[124]],
		[intersections[124], intersections[148]]
	];

	const starBarR = intersections[143].x * 2;
</script>

<DopplerSvg id="new" viewBox={viewBox(size)} zoom={0}>
	<defs>
		<style>
			circle,
			line.figure,
			path:not(.Background) {
				fill: none;
				stroke: oklch(1 0.37 135);
			}
			circle,
			line {
				stroke: oklch(0.5 0.37 240);
			}
			.phi {
				stroke: oklch(0.75 0.37 90);
			}
			circle.intersection {
				stroke: white;
			}
		</style>
	</defs>
	<Background {size} fill="black" />
	<line x1={-r} x2={r} />
	{#each circles as c, i}
		<circle class={[9, 10, 11, 12, 13, 14].includes(i) ? 'phi' : null} r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<!-- <path d={pentagram(goldenRadii[2])} /> -->
	<!-- <path d={polygonPath(5, goldenRadii[2])} /> -->
	<path d={polygonPath(6, goldenRadii[0])} />
	<path d={polygonPath(3, goldenRadii[0])} />
	<path d={polygonPath(3, goldenRadii[0], { rotate: 180 })} />

	<!-- <path d={polygonPath(6, goldenRadii[2])} /> -->

	{#each lines as l}
		<line class="figure" x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
	{/each}
	<!-- {#each intersections as p, i}
		<circle
			on:click={() => intersectionClick(i)}
			on:keydown={() => {}}
			class="intersection"
			r={2}
			cx={p.x}
			cy={p.y}
			stroke="white"
		/>
	{/each} -->
</DopplerSvg>
