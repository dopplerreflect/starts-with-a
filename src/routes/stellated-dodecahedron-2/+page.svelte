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
	const angles = anglesArray(6);
	const circles: Circle[] = [
		{ r, x: 0, y: 0 },
		...angles.map((a) => ({ r, ...radialPoint(a, r) }))
	];
	const oHexlines: Line[] = angles.map((a) => [radialPoint(a, r), radialPoint(a + 60, r)]);
	const iHexlines: Line[] = angles.map((a) => [radialPoint(a - 30, r1), radialPoint(a + 30, r1)]);
	const radials: Line[] = angles
		.slice(0, 3)
		.map((a) => [radialPoint(a + 30, r * Math.sqrt(3)), radialPoint(a + 210, r * Math.sqrt(3))]);
	const glines: Line[] = angles.slice(0, 6).map((a, i) => {
		return [
			circleLineIntersections(circles[((i + 11) % 6) + 1], iHexlines[i])[0],
			circleLineIntersections(circles[((i + 15) % 6) + 1], iHexlines[(i + 2) % 6])[0]
		];
	});
	const tlines: Line[] = [
		[radialPoint(angles[0] - 30, r1), radialPoint(angles[2] - 30, r1)],
		[radialPoint(angles[2] - 30, r1), radialPoint(angles[4] - 30, r1)],
		[radialPoint(angles[4] - 30, r1), radialPoint(angles[0] - 30, r1)],
		[radialPoint(angles[1] - 30, r1), radialPoint(angles[3] - 30, r1)],
		[radialPoint(angles[3] - 30, r1), radialPoint(angles[5] - 30, r1)],
		[radialPoint(angles[5] - 30, r1), radialPoint(angles[1] - 30, r1)]
	];
	const xlines: Line[] = [
		[radialPoint(angles[5] + 30, r1), intersection(radials[1], glines[1])],
		[intersection(radials[1], glines[1]), radialPoint(angles[3] + 30, r1)],
		[radialPoint(angles[3] + 30, r1), intersection(radials[2], glines[5])],
		[intersection(radials[2], glines[5]), radialPoint(angles[1] + 30, r1)],
		[radialPoint(angles[1] + 30, r1), intersection(radials[0], glines[3])],
		[intersection(radials[0], glines[3]), radialPoint(angles[5] + 30, r1)]
	];
	const faces: Point[][] = [
		[
			intersection(xlines[0], oHexlines[5]),
			intersection(xlines[0], glines[0]),
			intersection(oHexlines[4], iHexlines[4]),
			intersection(xlines[5], glines[4]),
			intersection(glines[4], glines[5]),
			intersection(glines[5], xlines[0]),
			intersection(iHexlines[0], oHexlines[0]),
			intersection(glines[2], glines[3])
		],
		[
			intersection(xlines[3], oHexlines[1]),
			intersection(xlines[4], glines[2]),
			intersection(oHexlines[0], iHexlines[1]),
			intersection(glines[0], xlines[3]),
			intersection(glines[0], glines[1]),
			intersection(glines[1], xlines[4]),
			intersection(iHexlines[2], oHexlines[2]),
			intersection(glines[4], glines[5])
		],
		[
			intersection(xlines[2], oHexlines[3]),
			intersection(glines[4], glines[5]),
			intersection(iHexlines[3], oHexlines[2]),
			intersection(xlines[1], glines[2]),
			intersection(glines[2], glines[3]),
			intersection(glines[3], xlines[2]),
			intersection(iHexlines[4], oHexlines[4]),
			intersection(glines[0], glines[1])
		],
		[
			intersection(xlines[0], oHexlines[5]),
			intersection(tlines[0], tlines[5]),
			intersection(tlines[5], glines[5]),
			intersection(glines[4], glines[5]),
			intersection(xlines[3], oHexlines[1]),
			intersection(tlines[0], tlines[3]),
			intersection(xlines[3], glines[0]),
			intersection(glines[0], glines[1])
		],
		[
			intersection(xlines[4], oHexlines[1]),
			intersection(tlines[1], tlines[3]),
			intersection(xlines[4], glines[1]),
			intersection(glines[0], glines[1]),
			intersection(xlines[1], oHexlines[3]),
			intersection(tlines[1], tlines[4]),
			intersection(glines[2], tlines[4]),
			intersection(glines[2], glines[3])
		],
		[
			intersection(xlines[2], oHexlines[3]),
			intersection(tlines[2], tlines[4]),
			intersection(xlines[2], tlines[4]),
			intersection(glines[2], glines[3]),
			intersection(xlines[5], oHexlines[5]),
			intersection(tlines[2], tlines[5]),
			intersection(xlines[5], tlines[5]),
			intersection(glines[4], glines[5])
		]
	];
</script>

<DopplerSvg id="star-tetrahedron" viewBox={viewBox(size)}>
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

	<g id="guide" filter="url(#blur)">
		{#each circles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
		{#each oHexlines as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} alignment-baseline="middle" text-anchor="middle"
				>o{i}</text
			>
		{/each}
		{#each tlines as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} alignment-baseline="middle" text-anchor="middle"
				>t{i}</text
			>
		{/each}
		{#each iHexlines as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} alignment-baseline="middle" text-anchor="middle"
				>i{i}</text
			>
		{/each}
		{#each radials as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		{/each}
		{#each glines as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} alignment-baseline="middle" text-anchor="middle"
				>g{i}</text
			>
		{/each}
		{#each xlines as l, i}
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
