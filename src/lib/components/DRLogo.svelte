<script lang="ts">
	import { phi, anglesArray, radialPointString, starPoints } from '$lib/geometry';
	export let size = 128;
	export let stroke = 'hsla(45, 100%, 100%, 0.25)';
	export let transform = '';
	const angles = anglesArray(30);
	const radii = [...Array(4).keys()].map((k) => (size / 2) * phi ** k);
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
</script>

<g id="DRLogo" {transform}>
	<path d={dPath} {stroke} fill="none" stroke-width={strokeWidth} />
	<path d={rPath} {stroke} fill="none" stroke-width={strokeWidth} />
	<g id="guide" {stroke} stroke-width={strokeWidth * phi ** 4}>
		{#each radii as r, i}
			<circle {r} fill="none" />
		{/each}
		{#each angles as a, i}
			<path d={`M${radialPointString(a, radii[2])}L${radialPointString(a, radii[0])}`} />
		{/each}
		<polygon points={starPoints(radii[0])} fill="none" />
	</g>
</g>
