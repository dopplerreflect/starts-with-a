<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import SourceCode from '$lib/components/SourceCode.svelte';
	import { phi, anglesArray, radialPointString, starPoints, viewBox } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { onMount } from 'svelte';
	const size = 1024;
	const solidColor = null;
	const angles = anglesArray(30);
	const radii = [...Array(4).keys()].map((k) => size * 0.45 * phi ** k);
	const strokeWidth = radii[2] - radii[3];
	const dPath = [
		'M',
		radialPointString(angles[0], radii[0]),
		'A',
		radii[0],
		radii[0],
		'0 1 1',
		radialPointString(angles[18], radii[0]),
		'Z'
	].join(' ');
	const rPath = [
		'M',
		radialPointString(angles[25], radii[1]),
		'A',
		radii[1],
		radii[1],
		'0 1 1',
		radialPointString(angles[11], radii[1]),
		'L',
		radialPointString(angles[12], radii[0]),
		'L',
		radialPointString(angles[15], radii[2]),
		'L',
		radialPointString(angles[17], radii[1]),
		'A',
		radii[1],
		radii[1],
		'0 0 1',
		radialPointString(angles[19], radii[1]),
		'L',
		radialPointString(angles[27], radii[2]),
		'Z'
	].join(' ');
	let svg: SVGSVGElement;
	onMount(() => useSaveFile(svg));
</script>

<svg bind:this={svg} id="DR-Logo" xmlns="http://www.w3.org/2000/svg" viewBox={viewBox(size)}>
	<defs>
		<g id="guide">
			{#each radii as r, i}
				<circle {r} fill="none" />
			{/each}
			{#each angles as a, i}
				<path d={`M${radialPointString(a, radii[2])}L${radialPointString(a, radii[0])}`} />
			{/each}
			<polygon points={starPoints(radii[0])} fill="none" />
		</g>
	</defs>
	<Background width={size} fill={solidColor ? 'none' : 'hsl(240, 50%, 15%)'} />
	<use
		href="#guide"
		stroke={solidColor ? solidColor : 'hsl(225, 100%, 75%)'}
		stroke-width={strokeWidth * phi ** 4}
	/>
	<path
		d={dPath}
		stroke={solidColor ? solidColor : 'hsl(225, 100%, 50%)'}
		fill="none"
		stroke-width={strokeWidth}
	/>
	<path
		d={rPath}
		stroke={solidColor ? solidColor : 'hsl(45, 100%, 50%)'}
		fill="none"
		stroke-width={strokeWidth}
	/>
</svg>
