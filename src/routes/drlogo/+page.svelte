<script lang="ts">
	import { φ, anglesArray, radialPoint, radialPointString } from '$lib/geometry';

	const size = 1024;
	const angles = anglesArray(30);
	const radii = [...Array(4).keys()].map((k) => size * 0.45 * φ ** k);
	const strokeWidth = radii[2] - radii[3];
	const starPath = [
		'M',
		...anglesArray(10)
			.map((a, i) => radialPointString(a, i % 2 == 0 ? radii[0] : radii[2]))
			.join('L'),
		'Z'
	].join('');

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
	console.log(rPath);
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
	<defs>
		<g id="guide">
			{#each radii as r, i}
				<text x={-size / 2 + 10} y={-r} text-anchor="middle" alignment-baseline="middle">{i}</text>
				<path d={`M${-size / 2 + 20} ${-r}H0`} />
				<circle {r} fill="none" />
			{/each}
			{#each angles as a, i}
				<path d={`M${radialPointString(a, radii[2])}L${radialPointString(a, radii[0])}`} />
				<text
					x={radialPoint(a, radii[0]).x}
					y={radialPoint(a, radii[0]).y}
					alignment-baseline="middle"
					text-anchor="middle">{i}</text
				>
			{/each}
			<path d={starPath} fill="none" />
		</g>
	</defs>
	<path
		d={`M${-size / 2} ${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="hsl(225, 100%, 15%)"
	/>
	<path d={dPath} stroke="hsl(225, 100%, 50%)" fill="none" stroke-width={strokeWidth} />
	<path d={rPath} stroke="hsl(45, 100%, 50%)" fill="none" stroke-width={strokeWidth} />
	<use href="#guide" stroke="hsl(180, 100%, 75%)" />
</svg>
