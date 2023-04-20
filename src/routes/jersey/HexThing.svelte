<script lang="ts">
	import { SQRT3, arrayMap, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';
	import SaturationFilter from '$lib/components/SaturationFilter.svelte';
	import DrLogo from '$lib/components/DRLogo.svelte';

	export let size = 2 ** 10;
	const cropToRound = true;

	const radii0 = arrayMap(5, (n) => (size / 11) * (n + 1));
	const radii1 = radii0.slice(0, 3).map((r) => SQRT3 * r);
	const radii = [
		...radii0,
		...radii1,
		Math.sqrt(radii0[0] ** 2 + radii1[1] ** 2),
		2 * (radii0[1] / SQRT3)
	].sort((a, b) => a - b);
	let a2 = 30 - Math.atan(radii[0] / radii[5]) * (180 / Math.PI);
	const angles12 = arrayMap(12, (n) => 30 * n - 90);
	const angles6 = angles12.filter((a) => a % 60 === 0);
	const atanAngles = angles6.map((a) => [a - a2, a + a2]).flat();
	const angles = [...angles12, ...atanAngles].sort((a, b) => a - b);

	const parse = pathFromDSL(angles, radii);
	let svg: SVGSVGElement;
</script>

<svg id="hex-thing" bind:this={svg} viewBox={viewBox(size)}>
	<defs>
		<SaturationFilter values={'1'} />
		<filter id="shrink" x={-size / 2} y={-size / 2} width={size} height={size}>
			<feMorphology in="SourceGraphic" operator="erode" radius={size / 384} result="shrink" />
			<feFlood flood-color={`hsl(240, 50%, 15%)`} flood-opacity="1" result="flood" />
			<feComposite in="flood" in2="shrink" operator="in" result="blacktiles" />
			<feGaussianBlur in="blacktiles" stdDeviation={size / 64} result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="shrink" />
			</feMerge>
		</filter>
		<style>
			.guide {
				stroke: hsl(270, 50%, 100%);
				fill: none;
				/* display: none; */
			}
			.guide text {
				fill: white;
			}

			#blocks-rotateSixth path,
			#blocks-rotateSixth circle,
			#large-ring path,
			#outer-ring path {
				filter: url(#shrink);
				stroke: black;
			}
			#lines {
				/* display: none; */
				fill: none;
				stroke: hsl(0, 100%, 50%);
			}
		</style>
		<g id="blocks-rotateSixth">
			<path
				id="r0radiusTriangle"
				d={parse('M22 0A0 0 0 0 0 0 1A0 0 0 0 0 2 0A0 0 0 0 0 22 0Z')}
				fill={`hsl(7.5, 75%, 50%)`}
			/>
			<path id="r1ScoopArc" d={parse('M0 1A0 0 0 0 0 4 1Z')} fill="hsl(15, 75%, 50%)" />
			<path id="r1r2Topper" d={parse('M0 1L2 2L4 1Z')} fill="hsl(22.5, 75%, 50%)" />
			<path id="r2r3Topper" d={parse('M22 2L0 3L2 2Z')} fill="hsl(30, 75%, 50%)" />
			<path
				id="upperRightSupport"
				d={`M${radii[0]} ${-radii[1]}H${radii[2]}L${radialPointString(angles[4], radii[3])}Z`}
				fill="hsl(37.5, 75%, 50%)"
			/>
			<path
				id="lowerRightSupport"
				d={`M${radii[0]} ${radii[1]}H${radii[2]}L${radialPointString(angles[8], radii[3])}Z`}
				fill="hsl(37.5, 75%, 50%)"
			/>
			<path
				id="upperRightScoop"
				d={`M${radii[2]} ${-radii[1]}A${radii[0]} ${radii[0]} 0 0 1 ${radialPointString(
					angles[3],
					radii[6]
				)}L${radii[0]} ${-radii[1]}Z`}
				fill="hsl(45, 75%, 50%)"
			/>
			<path
				id="lowerRightScoop"
				d={`M${radii[2]} ${radii[1]}A${radii[0]} ${radii[0]} 0 0 0 ${radialPointString(
					angles[9],
					radii[6]
				)}L${radii[0]} ${radii[1]}Z`}
				fill="hsl(45, 75%, 50%)"
			/>
			<path id="outerScoop" d={parse('M1 6A0 0 0 0 0 3 6L2 2Z')} fill="hsl(52.5, 75%, 50%)" />
			<path id="outerBowl" d={parse('M23 6A0 0 0 0 0 1 6Z')} fill="hsl(30, 75%, 50%)" />
			<path d={parse('M0 7A7 7 0 0 1 2 7L2 4A0 0 0 0 1 1 6L0 5Z')} fill={`hsl(240, 75%, 50%)`} />
			<path d={parse('M4 7A7 7 0 0 0 2 7L2 4A0 0 0 0 0 3 6L4 5Z')} fill={`hsl(240, 75%, 50%)`} />
		</g>
		<radialGradient id="rGradient">
			<stop offset="0%" stop-color="hsl(45, 100%, 50%)" />
			<stop offset="100%" stop-color="hsl(0, 100%, 30%)" />
		</radialGradient>
		<mask id="cropToRound">
			<radialGradient id="round">
				<stop offset={'91%'} stop-color="white" />
				<stop offset={'100%'} stop-color="black" />
			</radialGradient>
			<circle r={size / 2} fill="url(#round)" />
		</mask>
	</defs>

	<g id="whole" mask={cropToRound ? 'url(#cropToRound)' : null}>
		<g id="guide" class="guide" stroke-width={size / 512}>
			{#each angles6 as a}
				<circle r={radii[0]} cx={radialPoint(a, radii[2]).x} cy={radialPoint(a, radii[2]).y} />
				<circle
					r={radii[0]}
					cx={radialPoint(a + 30, radii[2] * SQRT3).x}
					cy={radialPoint(a + 30, radii[2] * SQRT3).y}
				/>
				<circle r={radii[0]} cx={radialPoint(a, radii[7]).x} cy={radialPoint(a, radii[7]).y} />
				<path
					d={`M${radialPointString(a + 30, radii[2] * SQRT3)}L${radialPointString(
						a + 90,
						radii[2] * SQRT3
					)}`}
				/>
			{/each}
			{#each angles as a, i}
				<path d={`M${radialPointString(a, radii[0])}L${radialPointString(a, radii[9])}`} />
				<!-- <text
					stroke="none"
					font-size={size / 64}
					x={radialPoint(a, radii[9]).x}
					y={radialPoint(a, radii[9]).y}
					text-anchor="middle"
					alignment-baseline="middle">{i}</text
				> -->
			{/each}
			{#each radii as r, i}
				<circle {r} />
				<!-- <path d={`M${-size / 2 + size / 48} ${-r}H0`} />
				<text
					stroke="none"
					font-size={size / 64}
					x={-size / 2 + size / 64}
					y={-r}
					alignment-baseline="middle"
					text-anchor="middle">{i}</text
				> -->
			{/each}
		</g>

		<g id="lines" stroke-width={size / 1024}>
			{#each angles6 as a}
				<path
					d={`M${radialPointString(a + 30, radii0[0] * SQRT3)}L${radialPointString(
						a + 90,
						radii[0] * SQRT3
					)}`}
				/>
				<path d={parse('M22 2L23 6L1 6L2 2Z')} transform={`rotate(${a})`} />
				<path d={`M${-radii[2]} 0V${-radii[1]}H${radii[2]}V0`} transform={`rotate(${a})`} />
			{/each}
		</g>

		<g id="blocks">
			{#each angles6 as a}
				<use
					xlink:href="#blocks-rotateSixth"
					transform={`rotate(${a})`}
					stroke-width={size / 384}
					fill-opacity={0.66}
				/>
			{/each}
		</g>

		<g id="large-ring" fill-opacity={0.66} stroke-width={size / 384}>
			{#each angles12 as a}
				<path
					d={parse('M22 8 A8 8 0 0 1 0 8L0 7A7 7 0 0 0 22 7Z')}
					fill={`hsl(45, 100%, 50%)`}
					transform={`rotate(${a + 15})`}
				/>
			{/each}
		</g>

		<g id="outer-ring" fill-opacity={0.8} stroke-width={size / 384}>
			<path
				d={parse('M0 9A9 9 0 0 0 12 9A9 9 0 0 0 0 9M0 8A8 8 0 0 0 12 8A8 8 0 0 0 0 8Z')}
				fill={`hsl(240, 75%, 50%)`}
				fill-rule="evenodd"
			/>
		</g>
	</g>
	<DrLogo size={radii[0] / 3} stroke="hsl(45, 100%, 50%)" />
</svg>
