<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import {
		SQRT3,
		anglesArray,
		circleLineIntersections,
		intersection,
		midpoint,
		pointToString,
		radialPoint,
		viewBox
	} from '$lib/geometry';

	const size = 2 ** 10;
	const r = size / 4;
	const r1 = Math.sqrt(r ** 2 - (r / 2) ** 2);
	const a = anglesArray(6);
	const c: Circle[] = [{ r, x: 0, y: 0 }, ...a.map((a) => ({ r, ...radialPoint(a, r) }))];
	const ol: Line[] = a.map((a) => [radialPoint(a, r), radialPoint(a + 60, r)]);
	const il: Line[] = a.map((a) => [radialPoint(a - 30, r1), radialPoint(a + 30, r1)]);
	const rl: Line[] = a.map((a) => [radialPoint(a + 30, r * Math.sqrt(3)), { x: 0, y: 0 }]);
	const gl: Line[] = a.slice(0, 6).map((a, i) => {
		return [
			circleLineIntersections(c[((i + 11) % 6) + 1], il[i])[0],
			circleLineIntersections(c[((i + 15) % 6) + 1], il[(i + 2) % 6])[0]
		];
	});
	const tl: Line[] = a.map((_, i) => [
		radialPoint(a[i] - 30, r1),
		radialPoint(a[(i + 2) % 6] - 30, r1)
	]);
	const xl: Line[] = [
		[radialPoint(a[5] + 30, r1), intersection(rl[1], gl[1])],
		[intersection(rl[1], gl[1]), radialPoint(a[3] + 30, r1)],
		[radialPoint(a[3] + 30, r1), intersection(rl[2], gl[5])],
		[intersection(rl[2], gl[5]), radialPoint(a[1] + 30, r1)],
		[radialPoint(a[1] + 30, r1), intersection(rl[0], gl[3])],
		[intersection(rl[0], gl[3]), radialPoint(a[5] + 30, r1)]
	];
	const faces: Point[][] = [
		[
			intersection(il[5], ol[5]),
			intersection(gl[0], gl[1]),
			intersection(il[4], ol[4]),
			intersection(xl[5], gl[4]),
			intersection(gl[4], gl[5]),
			intersection(gl[5], xl[0]),
			intersection(il[0], ol[0]),
			intersection(gl[2], gl[3])
		],
		[
			intersection(xl[3], ol[1]),
			intersection(xl[4], gl[2]),
			intersection(ol[0], il[1]),
			intersection(gl[0], xl[3]),
			intersection(gl[0], gl[1]),
			intersection(gl[1], xl[4]),
			intersection(il[2], ol[2]),
			intersection(gl[4], gl[5])
		],
		[
			intersection(xl[2], ol[3]),
			intersection(gl[4], gl[5]),
			intersection(il[3], ol[2]),
			intersection(xl[1], gl[2]),
			intersection(gl[2], gl[3]),
			intersection(gl[3], xl[2]),
			intersection(il[4], ol[4]),
			intersection(gl[0], gl[1])
		],
		[
			intersection(xl[0], ol[5]),
			intersection(tl[0], tl[5]),
			intersection(tl[5], gl[5]),
			intersection(gl[4], gl[5]),
			intersection(xl[3], ol[1]),
			intersection(tl[0], tl[1]),
			intersection(xl[3], gl[0]),
			intersection(gl[0], gl[1])
		],
		[
			intersection(xl[4], ol[1]),
			intersection(tl[1], tl[2]),
			intersection(xl[4], gl[1]),
			intersection(gl[0], gl[1]),
			intersection(xl[1], ol[3]),
			intersection(tl[2], tl[3]),
			intersection(gl[2], tl[3]),
			intersection(gl[2], gl[3])
		],
		[
			intersection(ol[3], xl[2]),
			intersection(tl[4], tl[3]),
			intersection(tl[3], xl[2]),
			intersection(gl[2], gl[3]),
			intersection(tl[4], ol[5]),
			intersection(tl[4], tl[5]),
			intersection(gl[4], tl[5]),
			intersection(gl[4], gl[5])
		]
	];
</script>

<DopplerSvg id="stellated-dodecahedron-2" viewBox={viewBox(size)}>
	<defs>
		<style>
			:root {
				--hue: 90;
				--opacity: 0.75;
			}
			circle,
			path:not(.Background),
			line {
				fill: none;
				stroke-width: 2;
			}
			#guide circle,
			#guide line {
				stroke: oklch(0.75 0.37 200);
			}
			path.star {
				stroke: none;
				fill-rule: evenodd;
			}
			path.star#star-0 {
				fill: oklch(0.9 0.37 var(--hue) / var(--opacity));
			}
			path.star#star-1 {
				fill: oklch(0.8 0.37 var(--hue) / var(--opacity));
			}
			path.star#star-2 {
				fill: oklch(0.7 0.37 var(--hue) / var(--opacity));
			}
			path.star#star-3 {
				fill: oklch(1 0.37 var(--hue) / var(--opacity));
			}
			path.star#star-4 {
				fill: oklch(0.55 0.37 var(--hue) / var(--opacity));
			}
			path.star#star-5 {
				fill: oklch(0.6 0.37 var(--hue) / var(--opacity));
			}
			text {
				fill: yellow;
				display: none;
			}
		</style>
		<filter id="blur">
			<feMorphology in="SourceGraphic" operator="dilate" radius="2" result="dilated" />
			<feGaussianBlur in="dilated" stdDeviation="8" result="b" />
			<feMerge>
				<feMergeNode in="b" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<HexPattern size={r1 / 18} stroke="oklch(25% 0.37 300)" strokeWidth={1} id="HexPattern" />
		<HexPattern size={r1 / 6} stroke="oklch(50% 0.37 200)" strokeWidth={1} id="HexPattern2" />
	</defs>
	<Background {size} fill="oklch(0 0.37 270)" />
	<Background {size} fill="url(#HexPattern)" />
	<Background {size} fill="url(#HexPattern2)" filter="url(#blur)" />

	<g id="guide" filter="url(#blu)">
		{#each c as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
		{#each ol as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} alignment-baseline="middle" text-anchor="middle"
				>o{i}</text
			>
		{/each}
		{#each il as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} alignment-baseline="middle" text-anchor="middle"
				>i{i}</text
			>
		{/each}
		{#each tl as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} alignment-baseline="middle" text-anchor="middle"
				>t{i}</text
			>
		{/each}
		{#each rl as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={l[0].x} y={l[0].y} alignment-baseline="middle" text-anchor="middle">r{i}</text>
		{/each}
		{#each gl as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} alignment-baseline="middle" text-anchor="middle"
				>g{i}</text
			>
		{/each}
		{#each xl as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} alignment-baseline="middle" text-anchor="middle"
				>x{i}</text
			>
		{/each}
	</g>
	{#each faces as f, i}
		<path class="star" id={`star-${i}`} d={`M${f.map((p) => pointToString(p))}Z`} />
	{/each}
</DopplerSvg>
