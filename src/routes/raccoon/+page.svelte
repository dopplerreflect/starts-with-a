<script lang="ts">
	import { φ, radialPoint, radialPointString } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { onMount } from 'svelte';
	const size = 512;
	const blueprintColor = 'hsl(220, 33%, 66%)';
	const angles = [...Array(36).keys()].map((k) => 10 * k);
	const radii = [...Array(5).keys()].map((k) => (size / 2) * φ ** k);
	const eyeRadius = (radii[2] - radii[3]) / 2;
	const noseRadius = (radii[1] - radii[2]) / 2;
	let svg: SVGSVGElement;
	onMount(() => useSaveFile(svg));
</script>

<svg
	bind:this={svg}
	id="raccoonFace"
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
>
	<defs>
		<g id="guide">
			{#each radii as r}
				<circle {r} stroke={blueprintColor} fill="none" />
			{/each}
			{#each angles as a, i}
				<path
					d={`M${radialPointString(a, radii[4])}L${radialPointString(a, radii[0])}`}
					stroke={blueprintColor}
				/>
				<text
					x={radialPoint(a, radii[1]).x}
					y={radialPoint(a, radii[1]).y}
					fill={blueprintColor}
					alignment-baseline="middle"
					text-anchor="middle">{i}</text
				>
			{/each}
		</g>
	</defs>
	<path
		d={`M${-size / 2},${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="hsl(0, 0%, 75%)"
	/>
	<!-- <image x={-size / 2} y={-size / 2} width={size} height={size} href="/raccoon.jpg" /> -->
	<!-- <use href="#guide" /> -->
	<g id="raccoonFace" style="opacity: 1">
		<g id="leftEar">
			<path
				d={[
					['M'],
					[radialPointString(angles[18], radii[1])],
					['C'],
					[radialPointString(angles[20], radii[0])],
					[radialPointString(angles[21], radii[0])],
					[radialPointString(angles[22], radii[0])],
					['S'],
					[radialPointString(angles[23], radii[0])],
					[radialPointString(angles[24], radii[1])]
				].join(' ')}
				stroke="black"
				fill="hsla(0, 0%, 100%, 1)"
			/>
		</g>
		<g id="rightEar">
			<path
				d={[
					['M'],
					[radialPointString(angles[0], radii[1])],
					['C'],
					[radialPointString(angles[34], radii[0])],
					[radialPointString(angles[33], radii[0])],
					[radialPointString(angles[32], radii[0])],
					['S'],
					[radialPointString(angles[31], radii[0])],
					[radialPointString(angles[30], radii[1])]
				].join(' ')}
				stroke="black"
				fill="hsla(0, 0%, 100%, 1)"
			/>
		</g>
		<g id="skull">
			<path
				d={[
					['M'],
					[radialPointString(angles[30], radii[1])],
					['A'],
					[radii[1]],
					[radii[1]],
					['0 0 0'],
					[radialPointString(angles[24], radii[1])],
					['A'],
					[radii[0]],
					[radii[0]],
					['0 0 0'],
					[radialPointString(angles[14], radii[0])],
					['A'],
					[radii[1]],
					[radii[1]],
					['0 0 1'],
					[radialPointString(angles[12], radii[1])],
					['A'],
					[radii[2]],
					[radii[1]],
					['0 0 1'],
					[radialPointString(angles[6], radii[1])],
					['A'],
					[radii[1]],
					[radii[1]],
					['0 0 1'],
					[radialPointString(angles[4], radii[0])],
					['A'],
					[radii[0]],
					[radii[0]],
					['0 0 0'],
					[radialPointString(angles[30], radii[1])],
					['Z']
				].join(' ')}
				stroke="black"
				fill="hsla(0, 0%, 50%, 1)"
			/>
		</g>
		<g id="leftCheek">
			<path
				d={[
					['M'],
					[radialPointString(angles[14], radii[0])],
					['C'],
					[radialPointString(angles[16], radii[0])],
					[radialPointString(angles[18], radii[2])],
					[radialPointString(angles[17], radii[3])],
					['S'],
					[radialPointString(angles[15], radii[4])],
					[radialPointString(angles[12], radii[1])],
					['A'],
					[radii[1]],
					[radii[1]],
					['0 0 0'],
					[radialPointString(angles[14], radii[0])]
				].join(' ')}
				stroke="black"
				fill="hsla(0, 0%, 25%, 1)"
			/>
		</g>
		<g id="leftEye">
			<circle
				cx={radialPoint(angles[15], radii[3] + eyeRadius).x}
				cy={radialPoint(angles[15], radii[3] + eyeRadius).y}
				r={eyeRadius}
				fill="hsl(0, 0%, 0%, 1)"
			/>
		</g>
		<g id="rightCheek">
			<path
				d={[
					['M'],
					[radialPointString(angles[4], radii[0])],
					['C'],
					[radialPointString(angles[2], radii[0])],
					[radialPointString(angles[0], radii[2])],
					[radialPointString(angles[1], radii[3])],
					['S'],
					[radialPointString(angles[3], radii[4])],
					[radialPointString(angles[6], radii[1])],
					['A'],
					[radii[1]],
					[radii[1]],
					['0 0 1'],
					[radialPointString(angles[4], radii[0])]
				].join(' ')}
				stroke="black"
				fill="hsla(0, 0%, 25%, 1)"
			/>
		</g>
		<g id="rightEye">
			<circle
				cx={radialPoint(angles[3], radii[3] + eyeRadius).x}
				cy={radialPoint(angles[3], radii[3] + eyeRadius).y}
				r={eyeRadius}
				fill="hsl(0, 0%, 0%, 1)"
			/>
		</g>
		<g id="snout">
			<path
				d={[
					['M'],
					[radialPointString(angles[12], radii[1])],
					['A'],
					[radii[2]],
					[radii[1]],
					['0 0 1'],
					[radialPointString(angles[6], radii[1])],
					['A'],
					[radii[2]],
					[radii[1]],
					['0 0 1'],
					[radialPointString(angles[12], radii[1])]
				].join(' ')}
				stroke="black"
				fill="hsl(0, 0%, 100%, 1)"
			/>
		</g>
		<g id="nose">
			<circle
				cx={radialPoint(angles[9], radii[2] + noseRadius).x}
				cy={radialPoint(angles[9], radii[2] + noseRadius).y}
				r={noseRadius}
				fill="hsl(0, 0%, 0%, 1)"
			/>
		</g>
	</g>
</svg>
