<script lang="ts">
	import { browser } from '$app/environment';
	import Background from '$lib/components/Background.svelte';
	import { arrayMap, phi, viewBox, radialPointString } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { onMount } from 'svelte';

	let size = browser ? Math.min(window.innerHeight, window.innerWidth) : 2 ** 13;
	let rotate90 = true;

	const angles = arrayMap(21, (n) => (360 / 21) * n + (rotate90 ? -90 : 0));
	const radii = arrayMap(9, (n) => Math.round((size / 2) * phi ** (n * 0.5)));
	let svg: SVGSVGElement;
	onMount(() => {
		const unmountSaveFile = useSaveFile(svg);
		return {
			unmountSaveFile
		};
	});
</script>

<svg id="84squares" bind:this={svg} viewBox={viewBox(size)}>
	<defs>
		<path
			id="thing"
			d={[
				'M',
				radialPointString(angles[0], radii[0]),
				'L',
				radialPointString(angles[1], radii[1]),
				'L',
				radialPointString(angles[0], radii[2]),
				'L',
				radialPointString(angles[1], radii[3]),
				'L',
				radialPointString(angles[0], radii[4]),
				'L',
				radialPointString(angles[1], radii[5]),
				'L',
				radialPointString(angles[0], radii[6]),
				'L',
				radialPointString(angles[1], radii[7]),
				'L',
				radialPointString(angles[0], radii[8]),
				'L',
				radialPointString(angles[20], radii[7]),
				'L',
				radialPointString(angles[0], radii[6]),
				'L',
				radialPointString(angles[20], radii[5]),
				'L',
				radialPointString(angles[0], radii[4]),
				'L',
				radialPointString(angles[20], radii[3]),
				'L',
				radialPointString(angles[0], radii[2]),
				'L',
				radialPointString(angles[20], radii[1]),
				'Z'
			].join(' ')}
			fill-opacity={1 / 2}
		/>
		<filter id="blur">
			<feMorphology in="SourceGraphic" operator="dilate" radius="1" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="3" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.1 0.185 270)" />
	<g filter="url(#blur)">
		{#each angles.slice(0, 21) as angle, i}
			<use
				href="#thing"
				fill={`oklch(0.75 0.37 ${angle})`}
				stroke="black"
				transform={`rotate(${angle + 90})`}
			/>
		{/each}
	</g>
</svg>
