<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		Phi,
		anglesArray,
		circleIntersections,
		circleLineIntersections,
		missingX,
		missingY,
		phi,
		radialPoint,
		slope,
		viewBox
	} from '$lib/geometry';

	const size = Phi * 1000;
	const r = 1000;
	const r1 = Math.sqrt((r * 1.5) ** 2 + ((r * Math.sqrt(3)) / 2) ** 2);
	const r2 = Math.sqrt(r1 ** 2 - r ** 2);
	const circles: Circle[] = [
		{ r, x: 0, y: 0 },
		...anglesArray(6).map((a) => ({ r, ...radialPoint(a, r) })),
		{ r: r1, x: 0, y: -r },
		{ r: r1, x: 0, y: r },
		{ r: r2, x: 0, y: 0 },
		// { r, x: r, y: 0 },
		// { r, x: -r, y: 0 },
		{ r: r * phi, x: 0, y: -r },
		{ r: r * phi, x: 0, y: r },
		{ r: r * phi ** 2, x: 0, y: 0 },
		{ r: r * phi ** 3, x: 0, y: -r * phi },
		{ r: r * phi ** 4, x: 0, y: -r },
		{ r: r * phi ** 5, x: 0, y: -r - r * phi ** 3 },
		{ r: r * phi ** 6, x: 0, y: -r - r * phi ** 2 }
	];
	const corners: Point[] = [
		{ x: -size, y: -size },
		{ x: size, y: -size },
		{ x: size, y: size },
		{ x: -size, y: size }
	];
	const lines: Line[] = [
		[corners[0], corners[2]],
		[corners[1], corners[3]],
		[corners[0], corners[1]],
		[corners[1], corners[2]],
		[corners[2], corners[3]],
		[corners[3], corners[0]],
		[
			{ x: 0, y: -size },
			{ x: 0, y: size }
		]
	];
	const pyramidIntersections = circleLineIntersections(circles[4], lines[4]);
	lines.push([{ x: 0, y: -size }, pyramidIntersections[0]]);
	lines.push([{ x: 0, y: -size }, pyramidIntersections[1]]);
	lines.push([
		corners[1],
		{
			x: missingX(
				corners[1],
				corners[3].y,
				slope([corners[1], { x: circles[4].x, y: circles[4].y }])
			),
			y: corners[3].y
		}
	]);
	lines.push([corners[1], circleLineIntersections(circles[8], lines[5])[1]]);
	lines.push([corners[1], circleLineIntersections(circles[7], lines[5])[0]]);
	lines.push([
		corners[1],
		{
			x: corners[0].x,
			y: missingY(
				corners[1],
				corners[0].x,
				slope([corners[1], circleLineIntersections(circles[1], lines[0])[0]])
			)
		}
	]);
	lines.push([
		corners[1],
		{
			x: corners[0].x,
			y: missingY(
				corners[1],
				corners[0].x,
				slope([corners[1], circleIntersections(circles[9], circles[10])[0]])
			)
		}
	]);
	circles.map((c) => console.log(c.r / 1000));
</script>

<DopplerSvg id="russian-pyramid" viewBox={viewBox(r1 * 2 + 10, (r1 * 2 + 10) * 1.77)}>
	<defs>
		<style>
			path.Background {
				fill: oklch(0 0.37 300);
			}
			circle,
			line {
				stroke-width: 5;
			}
			circle {
				fill: none;
				stroke: oklch(100% 0.37 180);
			}
			line {
				stroke: oklch(100% 0.37 90);
			}
			#c2,
			#c3,
			#c5,
			#c6,
			#l0 {
				display: none;
			}
		</style>
	</defs>
	<Background height={r * 2 + r1 * 2} width={r1 * 2} fill="" />
	<g transform="scale(-1 1)">
		{#each lines as l, i}
			<line id={`l${i}`} x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		{/each}
		{#each circles as c, i}
			<circle id={`c${i}`} r={c.r} cx={c.x} cy={c.y} />
		{/each}
		<circle r={r * Phi} />
	</g>
	<!-- <g transform="">
		{#each lines as l, i}
			<line id={`l${i}`} x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		{/each}
		{#each circles as c, i}
			<circle id={`c${i}`} r={c.r} cx={c.x} cy={c.y} />
		{/each}
	</g>
	<g transform="scale(-1 1) rotate(180)">
		{#each circles as c, i}
			<circle id={`c${i}`} r={c.r} cx={c.x} cy={c.y} />
		{/each}
		{#each lines as l, i}
			<line id={`l${i}`} x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		{/each}
	</g>
	<g transform="rotate(180)">
		{#each circles as c, i}
			<circle id={`c${i}`} r={c.r} cx={c.x} cy={c.y} />
		{/each}
		{#each lines as l, i}
			<line id={`l${i}`} x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		{/each}
	</g> -->
</DopplerSvg>
