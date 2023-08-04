<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		intersection,
		pentagram,
		phi,
		polygonPath,
		radialPoint,
		radialPointString,
		viewBox
	} from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';
	import { angleToRadians } from 'geometric';

	const size = 2 ** 10;
	const r = (size / 2) * Math.sqrt(phi);

	function chordLength(radius: number, angle: number): number {
		return radius * 2 * Math.sin(angle / 2);
	}

	const pcl = chordLength(phi * r, angleToRadians(72));
	const pcr = Math.sqrt((phi * r) ** 2 - (pcl / 2) ** 2);

	const dcl = chordLength(r, angleToRadians(36));
	const dcr = Math.sqrt(r ** 2 - (dcl / 2) ** 2);

	const angles = anglesArray(20, 18);
	let radii = [r, dcr, r * phi + r * phi ** 3, r * phi, pcr, pcr * phi ** 2];
	const parse = pathFromDSL(angles, radii);

	const l1: Line = [radialPoint(angles[12], radii[2]), radialPoint(angles[16], radii[2])];
	const l2: Line = [radialPoint(angles[13], radii[1]), radialPoint(angles[14], radii[4])];
	const l3: Line = [radialPoint(angles[12], radii[2]), radialPoint(angles[14], radii[0])];

	const i1 = intersection(l1, l2);
	const r1 = Math.sqrt(i1.x ** 2 + i1.y ** 2);

	const i2 = intersection(l2, l3);
	const r2 = Math.sqrt(i2.x ** 2 + i2.y ** 2);
</script>

<DopplerSvg id="doot" viewBox={viewBox(size)}>
	<defs>
		<style>
			circle,
			path:not(.Background) {
				stroke: white;
				fill: none;
			}
			path.fill {
				fill: white;
				stroke: black;
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.025 0.37 300)" />
	<!-- {#each radii as r, i}
		<circle {r} />
		<path d={`M${-size / 2 + 30} ${-r}H0`} />
		<text fill="white" x={-size / 2 + 15} y={-r}>{i}</text>
	{/each} -->
	{#each angles as a, i}
		<!-- <path d={`M0 0L${radialPointString(a, r)}`} /> -->
		<!-- <text fill="white" x={radialPoint(a, r).x} y={radialPoint(a, r).y}>{i}</text> -->
		{#if i % 4 === 0}
			<path d={`M${radialPointString(a, r * phi)}L${radialPointString(a, r)}`} />
			<!-- <path d={parse('M0 2L3 1L2 4L1 1L4 2Z')} transform={`rotate(${18 * i})`} /> -->
			<!-- <path d={parse('M0 0L4 3L2 0L0 3L 4 0Z')} transform={`rotate(${18 * i})`} /> -->
		{/if}
	{/each}
	<path d={polygonPath(10, r)} />
	<path d={polygonPath(5, r * phi, { rotate: 36 })} />
	<!-- <path d={polygonPath(5, r * phi + r * phi ** 3)} /> -->
	<!-- <path d={pentagram(r * phi, { rotate: 36 })} /> -->
	<!-- <path d={parse('M2 4L10 4L18 4L6 4L14 4Z')} /> -->

	<!-- <path d={`M${l1[0].x} ${l1[0].y}L${l1[1].x} ${l1[1].y}`} />
	<path d={`M${l2[0].x} ${l2[0].y}L${l2[1].x} ${l2[1].y}`} />
	<path d={`M${l3[0].x} ${l3[0].y}L${l3[1].x} ${l3[1].y}`} />
	<circle r={10} cx={i1.x} cy={i1.y} />
	<circle r={10} cx={Int32Array.x} cy={Int32Array.y} />
	<circle r={r1} />
	<circle r={r2} /> -->

	{#each anglesArray(5) as a}
		<g transform={`rotate(${a + 18})`}>
			<path class="fill" d={parse('M14 0L13 1') + `L${i2.x} ${i2.y}Z`} />
			<path class="fill" d={parse('M14 0L12 2') + `L${i1.x} ${i1.y}Z`} />
			<path class="fill" d={parse('M14 0L14 4') + `L${i1.x} ${i1.y}Z`} />
			<path class="fill" d={parse('M14 0L14 4') + `L${-i1.x} ${i1.y}Z`} />
			<path class="fill" d={parse('M14 0L16 2') + `L${-i1.x} ${i1.y}Z`} />
			<path class="fill" d={parse('M14 0L15 1') + `L${-i2.x} ${i2.y}Z`} />
			<path class="fill" d={parse('M12 5L14 4') + 'L0 0Z'} />
			<path class="fill" d={parse('M16 5L14 4') + 'L0 0Z'} />
		</g>
	{/each}
</DopplerSvg>
