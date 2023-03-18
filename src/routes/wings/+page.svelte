<script lang="ts">
	import { anglesArray, radialPointString, starPoints, φ } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';
	const size = 8092;
	const radii = [...Array(13).keys()].map((k) => (size / 2) * φ ** (k * 0.5));
	const gradientStops = [...Array(6).keys()].map((k) => Math.round(100 * φ ** k));
	const angles = anglesArray(60);
	let svg: SVGSVGElement;
	onMount(() => {
		const unMountUseZoomableViewbox = useZoomableViewbox(svg);
		const unMountSaveFile = useSaveFile(svg);
		return () => {
			unMountSaveFile();
			unMountUseZoomableViewbox();
		};
	});
</script>

<svg bind:this={svg} id="wings" viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
	<defs>
		<style>
			path,
			circle,
			polygon {
				stroke-width: 8px;
			}
		</style>
		<radialGradient id="gradient">
			{#each gradientStops as stop, i}
				<stop offset={`${100 - stop}%`} stop-color={`hsl(${300 - (60 / 6) * i}, 100%, 50%)`} />
			{/each}
		</radialGradient>
		<mask id="bgMask">
			<path d={`M${-size / 2} ${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`} fill="black" />
			<circle r={radii[0]} fill="white" />
		</mask>
		<g id="guide">
			{#each radii as r, i}
				<circle {r} fill="none" />
			{/each}
			{#each angles as a, i}
				<path d={`M${radialPointString(a, radii[0])}L${radialPointString(a, radii[12])}`} />
			{/each}
		</g>
	</defs>
	<path d={`M${-size / 2} ${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`} fill="black" />

	<path
		d={`M${-size / 2} ${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="url(#gradient)"
		mask="url(#bgMask)"
	/>
	{#each radii as r, i}
		<circle
			{r}
			fill={`hsla(210, 100%, ${(100 / 12) * i}%, 0.33)`}
			stroke={`hsl(210, 100%, ${50 - (100 / 12) * i}%)`}
		/>
	{/each}
	<use href="#guide" stroke="hsla(0, 0%, 75%, 0.25)" />
	<circle r={radii[12]} />
	<g stroke="hsla(210, 50%, 50%, 1)">
		<polygon points={starPoints(radii[0])} fill="none" />
		<polygon points={starPoints(radii[4])} fill="none" />
		<polygon points={starPoints(radii[8])} fill="none" />
		<polygon points={starPoints(radii[12])} fill="white" />
	</g>
	{#each [...Array(12).keys()].map((k) => k) as k, i}
		<path
			d={[
				'M',
				radialPointString(angles[12 + k], radii[12]),
				'L',
				radialPointString(angles[12 + k], radii[0 + k]),
				'Q',
				radialPointString(angles[13 + k], radii[0 + k]),
				radialPointString(angles[13 + k], radii[1 + k]),
				'L',
				radialPointString(angles[13 + k], radii[12]),
				'A',
				radii[12],
				radii[12],
				'0 0 0',
				radialPointString(angles[12 + k], radii[12]),
				'Z'
			].join(' ')}
			stroke={`hsl(210, 50%, ${50}%)`}
			fill={`hsla(210, 50%, ${100 - (100 / 12) * i}%, 0.75)`}
		/>
		<path
			d={[
				'M',
				radialPointString(angles[48 - k], radii[12]),
				'L',
				radialPointString(angles[48 - k], radii[0 + k]),
				'Q',
				radialPointString(angles[47 - k], radii[0 + k]),
				radialPointString(angles[47 - k], radii[1 + k]),
				'L',
				radialPointString(angles[47 - k], radii[12]),
				'A',
				radii[12],
				radii[12],
				'0 0 0',
				radialPointString(angles[48 - k], radii[12]),
				'Z'
			].join(' ')}
			stroke={`hsl(210, 50%, ${50}%)`}
			fill={`hsla(210, 50%, ${100 - (100 / 12) * i}%, 0.75)`}
		/>
	{/each}
</svg>
