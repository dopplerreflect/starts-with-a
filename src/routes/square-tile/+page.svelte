<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import PathBuilder from '$lib/components/PathBuilder.svelte';
	import SaturationFilter from '$lib/components/SaturationFilter.svelte';
	import {
		arrayMap,
		phi,
		polygonPath,
		radialPoint,
		radialPointString,
		starPath,
		viewBox
	} from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountSaveFile = useSaveFile(svg);
		// const unmountZoomable = useZoomableViewbox(svg, 5, 5, 5);
		const unmountZoomable = useZoomableViewbox(svg);
		return () => {
			unmountSaveFile();
			unmountZoomable();
		};
	});

	const size = 2 ** 10;
	const strokeWidth = size / 2 ** 10;
	const r0 = size / 2;
	const r1 = Math.sqrt(r0 ** 2 * 2);
	let r0radii = arrayMap(8, (n) => Number((r0 * phi ** n).toFixed(2)));
	r0radii = [...new Set([...r0radii, ...r0radii.map((r) => r0 - r)])]
		.sort((a, b) => b - a)
		.filter((n) => n > 0);
	let r1radii = arrayMap(8, (n) => Number((r0 * phi ** n).toFixed(2)));
	const r1circles: Circle[] = r1radii.map((r) => ({ r, x: 0, y: 0 }));
	r1radii = [...new Set([...r1radii.map((r) => r1 - r)])]
		.sort((a, b) => b - a)
		.filter((n) => n > 0);

	const angleCount = 80;
	const angles = arrayMap(angleCount, (n) => (360 / angleCount) * n - 90);
</script>

<svg bind:this={svg} viewBox={viewBox(size)}>
	<defs>
		<style>
			.guide {
				display: none;
			}
		</style>
		<mask id="boundary">
			<Background {size} fill="white" />
		</mask>
		<g id="corner">
			<path d={polygonPath(3, r0radii[7])} stroke="white" fill="none" />
			<path d={polygonPath(6, r0radii[8])} stroke="white" fill="none" />
			<path d={polygonPath(3, r0radii[9])} stroke="white" fill="none" />
			<path d={polygonPath(6, r0radii[9])} stroke="white" fill="none" />

			<path
				id="point"
				d={[
					'M',
					radialPointString(angles[0], r0radii[0]),
					radialPointString(angles[5], r0radii[5]),
					'L',
					radialPointString(angles[5], r0radii[7]),
					'A',
					r0radii[7],
					r0radii[7],
					'0 0 0',
					radialPointString(angles[75], r0radii[7]),
					'L',
					radialPointString(angles[75], r0radii[5]),
					'Z'
				].join(' ')}
				stroke={`hsla(30, 100%, 50%, 1)`}
				fill={`hsla(30, 100%, 10%, 0.5)`}
			/>

			<path
				id="pie"
				d={[
					'M',
					radialPointString(angles[10], r1radii[7]),
					'L',
					radialPointString(angles[5], r0radii[5]),
					'A',
					r0radii[5],
					r0radii[5],
					'0 0 0',
					radialPointString(angles[15], r0radii[5]),
					'Z'
				].join(' ')}
				stroke={`hsla(60, 100%, 50%, 1)`}
				fill={`hsla(60, 100%, 10%, 0.5)`}
			/>

			<path
				id="arc"
				d={[
					'M',
					radialPointString(angles[5], r0radii[7]),
					'L',
					radialPointString(angles[5], r1radii[7]),
					'A',
					r1radii[7],
					r1radii[7],
					'0 0 1',
					radialPointString(angles[15], r1radii[7]),
					'L',
					radialPointString(angles[15], r0radii[7]),
					'A',
					r0radii[7],
					r0radii[7],
					'0 0 0',
					radialPointString(angles[5], r0radii[7]),
					'Z'
				].join(' ')}
				stroke={`hsla(120, 100%, 50%, 1)`}
				fill={`hsla(120, 100%, 10%, 0.5)`}
			/>

			<path
				id="arc2"
				d={[
					'M',
					radialPointString(angles[5], r0radii[5]),
					'A',
					r0radii[5],
					r0radii[5],
					'0 0 1',
					radialPointString(angles[15], r0radii[5]),
					'L',
					radialPointString(angles[16], r1radii[6]),
					'A',
					r1radii[6],
					r1radii[6],
					'0 0 0',
					radialPointString(angles[4], r1radii[6]),
					'L',
					radialPointString(angles[5], r0radii[5]),
					'Z'
				].join(' ')}
				stroke={`hsla(120, 100%, 50%, 1)`}
				fill={`hsla(120, 100%, 10%, 0.5)`}
			/>

			<path
				d={polygonPath(3, r0radii[9], { rotate: 180, center: radialPoint(angles[0], r0radii[7]) })}
				stroke="yellow"
				fill="none"
			/>
			<path
				id="dodecagon-quadrant"
				d={[
					'M',
					radialPointString(angles[0], r0radii[0]),
					'L',
					radialPointString(angles[78], r0radii[3]),
					'L',
					radialPointString(angles[76], r0radii[0]),
					'L',
					radialPointString(angles[74], r0radii[3]),
					'L',
					radialPointString(angles[72], r0radii[0]),
					'L',
					radialPointString(angles[70], r0radii[3]),
					'L',
					radialPointString(angles[68], r0radii[0]),
					'L',
					radialPointString(angles[66], r0radii[3]),
					'L',
					radialPointString(angles[64], r0radii[0]),
					'L',
					radialPointString(angles[62], r0radii[3]),
					'L',
					radialPointString(angles[60], r0radii[0]),
					'L',
					radialPointString(angles[64], r1radii[6]),
					'A',
					r1radii[6],
					r1radii[6],
					'0 0 1',
					radialPointString(angles[76], r1radii[6]),

					'Z'
				].join(' ')}
				fill="hsla(270, 100%, 10%, 0.5)"
				stroke="hsla(270, 100%, 50%, 1"
				transform="scale(1.005)"
			/>
		</g>

		<g id="tile" mask="url(#boundary)">
			{#each angles as a, i}
				<path
					d={`M${radialPointString(a, r0radii[r0radii.length - 1])}L${radialPointString(a, r1)}`}
					stroke={`hsl(${a % 22.5 === 0 ? 30 : a % 18 === 0 ? 270 : 120}, 50%, 50%)`}
				/>
			{/each}
			<g id="quadrant">
				{#each arrayMap(4, (n) => n * 90) as a}
					<use href="#corner" transform={`rotate(${a})`} />
				{/each}
			</g>
			{#each arrayMap(4, (n) => n * 90) as a}
				<use
					href="#quadrant"
					transform={`rotate(${a}) translate(${-size / 2} ${-size / 2}) scale(0.6175) rotate(45)`}
					stroke-width={strokeWidth * 2}
				/>
			{/each}
		</g>
		<pattern id="tile-pattern" width={0.25} height={0.25}>
			<use
				href="#tile"
				transform={`scale(${0.25}) translate(${size / 2} ${size / 2})`}
				filter="url(#SaturationFilter)"
			/>
		</pattern>
		<SaturationFilter values="0.1" />
	</defs>

	<Background {size} fill="url(#tile-pattern)" />

	<use href="#tile" filter="" />
	<!-- <PathBuilder {size} {angles} radii={r0radii} /> -->
</svg>
