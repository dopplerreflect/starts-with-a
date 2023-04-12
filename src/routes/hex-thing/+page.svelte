<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import PathBuilder from '$lib/components/PathBuilder.svelte';
	import { SQRT3, arrayMap, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';
	import { pathFromDSL } from '$lib/path-parser';
	import { useSaveFile } from '$lib/save-svg';
	import SaturationFilter from '$lib/components/SaturationFilter.svelte';
	const size = 2 ** 10;
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
	onMount(() => {
		const unmountZoomable = useZoomableViewbox(svg, 0, 0, 0);
		const unmountSaveFile = useSaveFile(svg);
		return () => {
			unmountZoomable();
			unmountSaveFile();
		};
	});
</script>

<svg id="hex-thing" bind:this={svg} viewBox={viewBox(size)}>
	<defs>
		<SaturationFilter values={'1'} />
		<filter id="shrink" x={-size / 2} y={-size / 2} width={size} height={size}>
			<feMorphology in="SourceGraphic" operator="erode" radius={size / 384} result="shrink" />
			<feFlood flood-color="black" flood-opacity="1" result="flood" />
			<feComposite in="flood" in2="shrink" operator="in" result="blacktiles" />
			<feGaussianBlur in="blacktiles" stdDeviation={size / 64} result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="shrink" />
			</feMerge>
		</filter>

		<style>
			.guide {
				stroke: hsl(270, 50%, 50%);
				/* display: none; */
			}
			#blocks path,
			#blocks circle {
				filter: 'url(#shrink)';
				stroke: black;
			}
			#lines {
				/* display: none; */
				stroke: hsl(240, 25%, 50%);
			}
		</style>
	</defs>
	<g id="whole" filter="url(#SaturationFilter)">
		<Background {size} fill="hsl(270, 100%, 95%)" />

		<g id="guide" class="guide" stroke-width={size / 1024}>
			{#each angles6 as a}
				<circle
					class="guide"
					r={radii[0]}
					cx={radialPoint(a, radii[2]).x}
					cy={radialPoint(a, radii[2]).y}
					fill="none"
				/>
				<circle
					class="guide"
					r={radii[0]}
					cx={radialPoint(a + 30, radii[2] * SQRT3).x}
					cy={radialPoint(a + 30, radii[2] * SQRT3).y}
					fill="none"
				/>
				<circle
					class="guide"
					r={radii[0]}
					cx={radialPoint(a, radii[7]).x}
					cy={radialPoint(a, radii[7]).y}
					fill="none"
				/>
				<path
					class="guide"
					d={`M${radialPointString(a + 30, radii[2] * SQRT3)}L${radialPointString(
						a + 90,
						radii[2] * SQRT3
					)}`}
					stroke="hsl(270, 100%, 20%)"
					stroke-linejoin="round"
				/>
			{/each}
			{#each angles as a, i}
				<path d={`M${radialPointString(a, radii[0])}L${radialPointString(a, radii[9])}`} />
				<!-- <text
					fill="hsl(270, 100%, 20%)"
					stroke="none"
					font-size={size / 64}
					x={radialPoint(a, radii[9]).x}
					y={radialPoint(a, radii[9]).y}
					text-anchor="middle"
					alignment-baseline="middle">{i}</text
				> -->
			{/each}
			{#each radii as r, i}
				<circle {r} stroke-width={1} fill="none" />
				<!-- <path d={`M${-size / 2 + 30} ${-r}H0`} />
				<text
					fill="hsl(270, 100%, 20%)"
					stroke="none"
					font-size={size / 64}
					x={-size / 2 + 20}
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
				<path d={parse('M22 2L23 6L1 6L2 2Z')} fill="none" transform={`rotate(${a})`} />
				<path
					d={`M${-radii[2]} 0V${-radii[1]}H${radii[2]}V0`}
					fill="none"
					transform={`rotate(${a})`}
				/>
				<path d={parse('M0 7L0 8')} transform={`rotate(${30 + a})`} />
			{/each}
		</g>

		<g id="blocks" stroke-width={size / 512} fill-opacity={0.66}>
			<circle filter="url(#shrink)" r={radii[0]} fill={`hsl(0, 75%, 20%)`} />
			{#each angles6 as a}
				<path
					filter="url(#shrink)"
					id="r0radiusTriangle"
					d={parse('M22 0A0 0 0 0 0 0 1A0 0 0 0 0 2 0A0 0 0 0 0 22 0Z')}
					fill={`hsl(7.5, 75%, 50%)`}
					transform={`rotate(${a})`}
				/>
				<path
					filter="url(#shrink)"
					id="r1ScoopArc"
					d={parse('M0 1A0 0 0 0 0 4 1Z')}
					fill="hsl(15, 75%, 50%)"
					transform={`rotate(${a})`}
				/>
				<path
					filter="url(#shrink)"
					id="r1r2Topper"
					d={parse('M0 1L2 2L4 1Z')}
					fill="hsl(22.5, 75%, 50%)"
					transform={`rotate(${a})`}
				/>
				<path
					filter="url(#shrink)"
					id="r2r3Topper"
					d={parse('M22 2L0 3L2 2Z')}
					fill="hsl(30, 75%, 50%)"
					transform={`rotate(${a})`}
				/>
				<path
					filter="url(#shrink)"
					id="upperRightSupport"
					d={`M${radii[0]} ${-radii[1]}H${radii[2]}L${radialPointString(angles[4], radii[3])}Z`}
					fill="hsl(37.5, 75%, 50%)"
					transform={`rotate(${a})`}
				/>
				<path
					filter="url(#shrink)"
					id="lowerRightSupport"
					d={`M${radii[0]} ${radii[1]}H${radii[2]}L${radialPointString(angles[8], radii[3])}Z`}
					fill="hsl(37.5, 75%, 50%)"
					transform={`rotate(${a})`}
				/>
				<path
					filter="url(#shrink)"
					id="upperRightScoop"
					d={`M${radii[2]} ${-radii[1]}A${radii[0]} ${radii[0]} 0 0 1 ${radialPointString(
						angles[3],
						radii[6]
					)}L${radii[0]} ${-radii[1]}Z`}
					fill="hsl(45, 75%, 50%)"
					transform={`rotate(${a})`}
				/>
				<path
					filter="url(#shrink)"
					id="lowerRightScoop"
					d={`M${radii[2]} ${radii[1]}A${radii[0]} ${radii[0]} 0 0 0 ${radialPointString(
						angles[9],
						radii[6]
					)}L${radii[0]} ${radii[1]}Z`}
					fill="hsl(45, 75%, 50%)"
					transform={`rotate(${a})`}
				/>
				<path
					filter="url(#shrink)"
					id="outerScoop"
					d={parse('M1 6A0 0 0 0 0 3 6L2 2Z')}
					fill="hsl(52.5, 75%, 50%"
					transform={`rotate(${a})`}
				/>
				<path
					filter="url(#shrink)"
					id="outerBowl"
					d={parse('M23 6A0 0 0 0 0 1 6Z')}
					fill="hsl(30, 75%, 50%)"
					transform={`rotate(${a})`}
				/>
			{/each}
		</g>

		<g id="rings" fill-opacity={0.66}>
			<path
				d={parse(
					'M0 7A7 7 0 0 0 12 7A7 7 0 0 0 0 7M23 6L1 6A0 0 0 0 0 3 6L5 6A0 0 0 0 0 7 6L9 6A0 0 0 0 0 11 6L13 6A0 0 0 0 0 15 6L17 6A0 0 0 0 0 19 6L21 6A0 0 0 0 0 23 6Z'
				)}
				stroke="black"
				stroke-width={size / 256}
				stroke-linejoin="round"
				fill={`hsl(240, 25%, 50%)`}
				fill-rule="evenodd"
				transform={`rotate(${0})`}
				filter="url(#shrink)"
			/>

			<path
				d={parse('M0 8A8 8 0 0 0 12 8A8 8 0 0 0 0 8M0 7A7 7 0 0 0 12 7A7 7 0 0 0 0 7Z')}
				stroke="black"
				stroke-width={size / 256}
				fill={`hsl(240, 25%, 25%)`}
				fill-rule="evenodd"
				filter="url(#shrink)"
			/>

			<path
				d={parse('M0 9A9 9 0 0 0 12 9A9 9 0 0 0 0 9M0 8A8 8 0 0 0 12 8A8 8 0 0 0 0 8Z')}
				stroke="black"
				stroke-width={size / 256}
				fill={`hsl(240, 25%, 50%)`}
				fill-rule="evenodd"
				filter="url(#shrink)"
			/>
		</g>
		<!-- <PathBuilder {angles} {radii} /> -->
	</g>
</svg>
