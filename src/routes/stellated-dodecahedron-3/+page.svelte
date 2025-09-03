<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		phi,
		radialPoint,
		pentagram,
		Phi,
		midpoint,
		pointToString,
		intersection,
		arrayMap
	} from '$lib/geometry';

	const size = 2 ** 10;
	const angles10 = anglesArray(10);
	const angles5 = anglesArray(5, 90);
	const ro = size / 4.1;
	const radii = [ro, ro * phi];
	const circles: Circle[] = angles10
		.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) })))
		.flat();
	const pl: Line[] = angles5.map((a, i) => [
		radialPoint(a, ro * Phi),
		radialPoint(angles5[(i + 2) % 5], ro * Phi)
	]);
	const rl: Line[] = angles5.map((a, i) => [{ x: 0, y: 0 }, radialPoint(a + 36, ro * Phi)]);
	const tl: Line[] = angles10.map((a, i) => [
		radialPoint(a, ro * Phi),
		radialPoint(angles10[(i + 3) % 10], ro * Phi)
	]);
	const sideStarPath = [
		'M',
		pointToString(intersection(tl[8], tl[0])),
		pointToString(intersection(tl[8], rl[2])),
		pointToString(intersection(rl[2], pl[2])),
		pointToString(intersection(pl[2], rl[3])),
		pointToString(intersection(rl[3], tl[1])),
		pointToString(intersection(tl[1], tl[9])),
		pointToString(intersection(tl[9], rl[3])),
		pointToString(intersection(rl[3], tl[0])),
		pointToString(intersection(tl[0], pl[2])),
		pointToString(intersection(pl[2], rl[3])),
		pointToString(intersection(rl[3], rl[2])),
		pointToString(intersection(rl[2], pl[2])),
		pointToString(intersection(pl[2], tl[9])),
		pointToString(intersection(tl[9], rl[2])),
		pointToString(intersection(rl[2], tl[0])),
		'Z'
	].join(' ');
	const bgr = arrayMap(Math.floor(size / 15), (i) => i * 8);
</script>

<DopplerSvg id="stellated-dodecahedron-3" {size}>
	<defs>
		<filter id="blur">
			<feMorphology in="SourceGraphic" operator="dilate" radius="1" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="10" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="blur2">
			<feMorphology in="SourceGraphic" operator="dilate" radius="2" result="dilated" />
			<feGaussianBlur in="dilated" stdDeviation="8" result="b" />
			<feMerge>
				<feMergeNode in="b" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>

		<path id="sideStar" class="sideStar" d={sideStarPath} />
		<style>
			:root {
				--chroma: 0.37;
				--opacity: 0.8;
			}
			circle {
				fill: none;
				stroke: oklch(0.99 0.37 200);
				stroke-width: 2;
			}
			line {
				stroke: none;
				stroke: oklch(0.99 0.37 200);
			}
			text {
				fill: yellow;
				display: none;
			}
			#penta {
				fill-rule: evenodd;
				fill: oklch(0.9 var(--chroma) 90 / var(--opacity));
			}
			#sideStar0 {
				fill: oklch(0.99 var(--chroma) 90 / var(--opacity));
			}
			#sideStar1 {
				fill: oklch(0.85 var(--chroma) 90 / var(--opacity));
			}
			#sideStar2 {
				fill: oklch(0.7 var(--chroma) 90 / var(--opacity));
			}
			#sideStar3 {
				fill: oklch(0.75 var(--chroma) 90 / var(--opacity));
			}
			#sideStar4 {
				fill: oklch(0.95 var(--chroma) 90 / var(--opacity));
			}
			#guide,
			#bgcircles {
				filter: url(#blur);
				/* display: none; */
			}
			#figure {
				/* display: none; */
			}
			circle.bg {
				stroke: oklch(0.3 0.37 200);
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.01 0.37 300)" />
	<g id="bgcircles">
		{#each bgr as r}
			{#each angles5 as a}
				<circle class="bg" {r} cx={radialPoint(a, ro * Phi).x} cy={radialPoint(a, ro * Phi).y} />
			{/each}
		{/each}
	</g>
	<g id="guide">
		{#each angles5 as a, i}
			<text
				x={radialPoint(a, ro * 2).x}
				y={radialPoint(a, ro * 2).y}
				text-anchor="middle"
				alignment-baseline="middle">{`a${i}`}</text
			>
		{/each}
		{#each circles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
		{#each pl as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} text-anchor="middle" alignment-baseline="middle"
				>{`pl${i}`}</text
			>
		{/each}
		{#each rl as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} text-anchor="middle" alignment-baseline="middle"
				>{`rl${i}`}</text
			>
		{/each}
		{#each tl as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} text-anchor="middle" alignment-baseline="middle"
				>{`tl${i}`}</text
			>
		{/each}
	</g>
	<g id="figure">
		{#each angles5 as a, i}
			<use id={`sideStar${i}`} href="#sideStar" transform={`rotate(${a - 90})`} />
		{/each}
		<path id="penta" d={pentagram(ro * Phi, { rotate: 36 })} />
	</g>
</DopplerSvg>
