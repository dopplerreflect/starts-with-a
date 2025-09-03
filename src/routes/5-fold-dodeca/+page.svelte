<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		arrayMap,
		chordLength,
		intersection,
		midpoint,
		phi,
		pointToString,
		radialPoint,
		starPath,
		viewBox
	} from '$lib/geometry';

	const size = 2 ** 10;
	const angles = anglesArray(10, 18);
	const angles2 = anglesArray(10, 0);
	const or = (size / 2) * 0.95;
	const r = Math.sqrt(or ** 2 - (chordLength(36 * (Math.PI / 180), or) / 2) ** 2);
	const radii = [r, r - r * phi ** 4];
	const op: Line[] = angles.map((a, i) => [
		radialPoint(angles[i], r),
		radialPoint(angles[(i + 2) % 10], r)
	]);
	console.log(op);
	const ip: Line[] = [0, 2, 4, 6, 8].map((i) => [
		radialPoint(angles2[i], radii[1]),
		radialPoint(angles2[(i + 2) % 10], radii[1])
	]);
	const sp: Array<Line> = [0, 2, 4, 6, 8]
		.map((i) => [
			[radialPoint(angles[i], r), radialPoint(angles[(i + 4) % 10], r)],
			[radialPoint(angles[i + 1], r), radialPoint(angles[(i + 5) % 10], r)]
		])
		.flat(1);
	let i = intersection(sp[0], sp[3]);
	radii.push(Math.sqrt(i.x ** 2 + i.y ** 2));
	const pl: Line[] = [1, 3, 5, 7, 9].map((i) => [
		radialPoint(angles2[i], radii[2]),
		radialPoint(angles2[(i + 4) % 10], radii[2])
	]);
	const al: Line[] = [
		[intersection(ip[3], sp[3]), intersection(ip[0], sp[0])],
		[intersection(ip[4], sp[5]), intersection(ip[1], sp[2])],
		[intersection(ip[0], sp[7]), intersection(ip[2], sp[4])],
		[intersection(ip[1], sp[9]), intersection(ip[3], sp[6])],
		[intersection(ip[2], sp[1]), intersection(ip[4], sp[8])]
	];

	const sideStarPath = [
		'M',
		pointToString(intersection(sp[6], op[6])),
		pointToString(intersection(op[6], op[5])),
		pointToString(intersection(op[5], sp[3])),
		pointToString(intersection(sp[3], op[6])),
		pointToString(intersection(op[6], ip[3])),
		pointToString(intersection(ip[3], sp[3])),
		pointToString(intersection(sp[3], sp[6])),
		pointToString(intersection(sp[6], ip[3])),
		pointToString(intersection(ip[3], op[5])),
		pointToString(intersection(op[5], sp[6])),
		'Z',
		'M',
		pointToString(intersection(op[6], op[7])),
		pointToString(intersection(op[7], sp[8])),
		pointToString(intersection(sp[8], op[6])),
		'Z',
		'M',
		pointToString(intersection(al[4], sp[8])),
		pointToString(intersection(sp[8], pl[2])),
		pointToString(intersection(pl[2], pl[3])),
		pointToString(intersection(al[4], al[0])),
		'Z',
		'M',
		pointToString(intersection(pl[1], pl[2])),
		pointToString(intersection(pl[2], sp[1])),
		pointToString(intersection(sp[1], al[4])),
		pointToString(intersection(al[4], al[3])),
		'Z',
		'M',
		pointToString(intersection(ip[3], op[4])),
		pointToString(intersection(op[4], sp[1])),
		pointToString(intersection(sp[1], op[5])),
		'Z'
	].join(' ');

	const frontFacePath = [
		'M',
		pointToString(intersection(ip[3], ip[4])),
		pointToString(intersection(ip[4], al[4])),
		pointToString(intersection(al[4], al[0])),
		pointToString(intersection(al[0], ip[3])),
		'Z'
	].join(' ');
</script>

<DopplerSvg id="5-fold-dodeca" viewBox={viewBox(size)}>
	<defs>
		<style>
			:root {
				--chroma: 0.5;
				--hue: 100;
				--opacity: 0.75;
			}
			path.Background {
				stroke: none;
			}
			circle,
			line {
				stroke: oklch(0.99 0.37 200);
				fill: none;
				filter: url(#blur);
			}
			text {
				fill: yellow;
				display: none;
			}
			path {
				/* stroke: oklch(1 0.37 100 / 0.75); */
			}
			.ssp0 {
				fill: oklch(0.99 var(--chroma) var(--hue) / var(--opacity));
			}
			.ssp1 {
				fill: oklch(0.95 var(--chroma) var(--hue) / var(--opacity));
			}
			.ssp2 {
				fill: oklch(0.8 var(--chroma) var(--hue) / var(--opacity));
			}
			.ssp3 {
				fill: oklch(0.75 var(--chroma) var(--hue) / var(--opacity));
			}
			.ssp4 {
				fill: oklch(0.85 var(--chroma) var(--hue) / var(--opacity));
			}
			.ffp {
				fill: oklch(0.9 var(--chroma) var(--hue) / var(--opacity));
			}
			#guide {
				/* display: none; */
			}
			#figure {
				/* display: none; */
			}
			#background line {
				stroke: oklch(0.1 0.37 300);
				filter: none;
			}
		</style>
		<path id="sideStarPath" d={sideStarPath} />
		<path id="frontFacePath" d={frontFacePath} />
		<filter id="glow">
			<feMorphology in="SourceAlpha" operator="dilate" radius="20" result="dilate" />
			<feFlood in="dilate" flood-color="oklch(0.99 0.37 90 / 0.2)" result="color" />
			<feComposite in="color" in2="dilate" operator="in" result="border" />
			<feGaussianBlur in="border" stdDeviation="20" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="blur" x={-size / 2} y={-size / 2} filterUnits="userSpaceOnUse">
			<feMorphology in="SourceGraphic" operator="dilate" radius="2" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="10" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.2 0.09 300)" />
	<g id="background">
		{#each arrayMap(size / 8, (s) => s) as y}
			<line x1={-size / 2} y1={-size / 2 + y * 8} x2={size / 2} y2={-size / 2 + y * 8} />
			<line y1={-size / 2} x1={-size / 2 + y * 8} y2={size / 2} x2={-size / 2 + y * 8} />
		{/each}
	</g>
	<g id="guide">
		<!-- {#each radii as r}
			<circle {r} />
		{/each} -->
		{#each angles2 as a}
			<circle r={or / 2} cx={radialPoint(a, or / 2).x} cy={radialPoint(a, or / 2).y} />
			<circle r={(or / 2) * phi} cx={radialPoint(a, or / 2).x} cy={radialPoint(a, or / 2).y} />
			<circle r={(or / 2) * phi ** 2} cx={radialPoint(a, or / 2).x} cy={radialPoint(a, or / 2).y} />
		{/each}
		{#each op as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} text-anchor="middle" alignment-baseline="middle"
				>{`op${i}`}</text
			>
		{/each}
		{#each ip as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} text-anchor="middle" alignment-baseline="middle"
				>{`ip${i}`}</text
			>
		{/each}
		<!-- {#each sp as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} text-anchor="middle" alignment-baseline="middle"
				>{`sp${i}`}</text
			>
		{/each} -->
		{#each al as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} text-anchor="middle" alignment-baseline="middle"
				>{`al${i}`}</text
			>
		{/each}
		{#each pl as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
			<text x={midpoint(l).x} y={midpoint(l).y} text-anchor="middle" alignment-baseline="middle"
				>{`pl${i}`}</text
			>
		{/each}
	</g>
	<g id="figure" filter="url(#glow)">
		{#each anglesArray(5, 0).map((a) => a) as a, i}
			<use href="#sideStarPath" transform={`rotate(${a})`} class={`ssp${i}`} />
			<use href="#frontFacePath" transform={`rotate(${a})`} class="ffp" />
		{/each}
		<path d={starPath(radii[2], { rotate: -18 })} class="ffp" />
	</g>
</DopplerSvg>
