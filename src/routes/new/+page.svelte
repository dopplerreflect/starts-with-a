<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		circleIntersections,
		circleLineIntersections,
		pentagram,
		polygonPath,
		viewBox
	} from '$lib/geometry';
	const size = 2 ** 11;
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
</script>

<DopplerSvg id="new" viewBox={viewBox(size)} zoom={5}>
	<defs>
		<style>
			circle,
			path:not(.Background) {
				fill: none;
				stroke: orange;
			}
			circle.dim {
				stroke: #66f;
			}
		</style>
	</defs>
	<Background {size} fill="black" />
	<line x1={-r} x2={r} stroke="orange" />
	<!-- <path d={`M${pentaSections[0].x} ${pentaSections[0].y}H${pentaSections[1].x}`} /> -->
	{#each circles as c}
		<circle class="dim" r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<path d={pentagram(goldenRadii[2])} />
	<path d={polygonPath(5, goldenRadii[2])} />
	<path d={polygonPath(6, goldenRadii[0])} />
	<path d={polygonPath(3, goldenRadii[0])} />
	<path d={polygonPath(3, goldenRadii[0], { rotate: 180 })} />
</DopplerSvg>
