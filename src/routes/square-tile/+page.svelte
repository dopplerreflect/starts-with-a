<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DrLogo from '$lib/components/DRLogo.svelte';
	import SaturationFilter from '$lib/components/SaturationFilter.svelte';
	import {
		arrayMap,
		phi,
		polygonPath,
		radialPoint,
		radialPointString,
		viewBox
	} from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountSaveFile = useSaveFile(svg);
		const unmountZoomable = useZoomableViewbox(svg);
		return () => {
			unmountSaveFile();
			unmountZoomable();
		};
	});

	const size = 2 ** 10;
	const strokeWidth = size / 2 ** 8;
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

<svg id="whoa-tile" bind:this={svg} viewBox={viewBox(size)}>
	<defs>
		<style>
			.guide {
				display: none;
			}
		</style>
		<mask id="boundary">
			<Background {size} fill="white" />
		</mask>
		<g id="corner" stroke-width={strokeWidth}>
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
				stroke="black"
				fill={`hsl(30, 100%, 50%)`}
				fill-opacity={0.85}
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
				stroke="black"
				fill={`hsl(45, 100%, 45%)`}
				fill-opacity={0.9}
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
				stroke="black"
				fill={`hsl(60, 100%, 66%)`}
				fill-opacity={0.75}
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
				stroke="black"
				fill={`hsl(60, 100%, 66%)`}
				fill-opacity={0.75}
			/>

			<path
				d={polygonPath(3, r0radii[9], { rotate: 180, center: radialPoint(angles[0], r0radii[7]) })}
				stroke="black"
				fill={`hsl(0, 100%, 50%)`}
				fill-opacity={0.85}
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
				stroke="black"
				fill="hsl(45, 100%, 100%)"
				fill-opacity={0.75}
				transform="scale(1.005)"
			/>
		</g>

		<g id="tile" mask="url(#boundary)">
			<g id="quadrant">
				{#each arrayMap(4, (n) => n * 90) as a}
					<use xlink:href="#corner" transform={`rotate(${a})`} />
				{/each}
			</g>
			{#each arrayMap(4, (n) => n * 90) as a}
				<use
					xlink:href="#quadrant"
					transform={`rotate(${a}) translate(${-size / 2} ${-size / 2}) scale(0.6175) rotate(45)`}
				/>
			{/each}
		</g>
		<pattern id="tile-pattern" width={0.25} height={0.25}>
			<use
				xlink:href="#tile"
				transform={`scale(${0.25}) translate(${size / 2} ${size / 2})`}
				filter="url(#SaturationFilter)"
			/>
		</pattern>
		<SaturationFilter values="0.0" />
	</defs>

	<Background {size} fill="hsl(240, 50%, 20%)" />
	<Background {size} fill="url(#tile-pattern)" />

	<use xlink:href="#tile" filter="url(#SaturationFilte)" />

	<DrLogo
		size={size / 20}
		stroke="hsl(30, 100%, 100%)"
		transform={`translate(${size / 2 - size / 40} ${size / 2 - size / 40})`}
	/>
</svg>
