<script lang="ts">
	import { φ, radialPoint, radialPointString } from '$lib/geometry';
	export let size = 512;
	export let rotate = 0;
	export let center = { x: 0, y: 0 };
	export let hue = 0;
	export let saturation = 100;
	const angles = [...Array(36).keys()].map((k) => 10 * k);
	const radii = [...Array(5).keys()].map((k) => Number(((size / 2) * φ ** k).toFixed(2)));
	const eyeRadius = Number(((radii[2] - radii[3]) / 2).toFixed(2));
	const noseRadius = Number(((radii[1] - radii[2]) / 2).toFixed(2));
</script>

<g id="raccoonFace" transform={`rotate(${rotate}, ${center.x}, ${center.y})`}>
	<path
		d={[
			['M'],
			[radialPointString(angles[18], radii[1], { center })],
			['C'],
			[radialPointString(angles[20], radii[0], { center })],
			[radialPointString(angles[21], radii[0], { center })],
			[radialPointString(angles[22], radii[0], { center })],
			['Q'],
			[radialPointString(angles[23], radii[0], { center })],
			[radialPointString(angles[24], radii[2], { center })],
			['Z']
		].join(' ')}
		stroke="black"
		stroke-width={size / 128}
		fill={`hsl(${hue}, ${saturation}%, 90%)`}
	/>
	<path
		d={[
			['M'],
			[radialPointString(angles[0], radii[1], { center })],
			['C'],
			[radialPointString(angles[34], radii[0], { center })],
			[radialPointString(angles[33], radii[0], { center })],
			[radialPointString(angles[32], radii[0], { center })],
			['Q'],
			[radialPointString(angles[31], radii[0], { center })],
			[radialPointString(angles[30], radii[2], { center })],
			['Z']
		].join(' ')}
		stroke="black"
		stroke-width={size / 128}
		fill={`hsl(${hue}, ${saturation}%, 90%)`}
	/>
	<path
		d={[
			['M'],
			[radialPointString(angles[30], radii[1], { center })],
			['A'],
			[radii[1]],
			[radii[1]],
			['0 0 0'],
			[radialPointString(angles[24], radii[1], { center })],
			['A'],
			[radii[0]],
			[radii[0]],
			['0 0 0'],
			[radialPointString(angles[14], radii[0], { center })],
			['A'],
			[radii[1]],
			[radii[1]],
			['0 0 1'],
			[radialPointString(angles[12], radii[1], { center })],
			['A'],
			[radii[2]],
			[radii[1]],
			['0 0 1'],
			[radialPointString(angles[6], radii[1], { center })],
			['A'],
			[radii[1]],
			[radii[1]],
			['0 0 1'],
			[radialPointString(angles[4], radii[0], { center })],
			['A'],
			[radii[0]],
			[radii[0]],
			['0 0 0'],
			[radialPointString(angles[30], radii[1], { center })],
			['Z']
		].join(' ')}
		stroke="black"
		stroke-width={size / 128}
		fill={`hsl(${hue}, ${saturation}%, 50%)`}
	/>
	<path
		d={[
			['M'],
			[radialPointString(angles[14], radii[0], { center })],
			['C'],
			[radialPointString(angles[16], radii[0], { center })],
			[radialPointString(angles[18], radii[2], { center })],
			[radialPointString(angles[17], radii[3], { center })],
			['S'],
			[radialPointString(angles[15], radii[4], { center })],
			[radialPointString(angles[12], radii[1], { center })],
			['A'],
			[radii[1]],
			[radii[1]],
			['0 0 0'],
			[radialPointString(angles[14], radii[0], { center })],
			['Z']
		].join(' ')}
		stroke="white"
		stroke-width={size / 128}
		fill={`hsl(${hue}, ${saturation}%, 25%)`}
	/>
	<circle
		cx={radialPoint(angles[15], radii[3] + eyeRadius, { center }).x}
		cy={radialPoint(angles[15], radii[3] + eyeRadius, { center }).y}
		r={eyeRadius}
		fill="hsl(0, 0%, 0%)"
	/>
	<circle
		cx={radialPoint(angles[15], radii[3] + eyeRadius * φ, { center }).x}
		cy={radialPoint(angles[15], radii[3] + eyeRadius * φ, { center }).y}
		r={Number((eyeRadius * φ ** 2).toFixed(2))}
		fill="white"
	/>
	<path
		d={[
			['M'],
			[radialPointString(angles[4], radii[0], { center })],
			['C'],
			[radialPointString(angles[2], radii[0], { center })],
			[radialPointString(angles[0], radii[2], { center })],
			[radialPointString(angles[1], radii[3], { center })],
			['S'],
			[radialPointString(angles[3], radii[4], { center })],
			[radialPointString(angles[6], radii[1], { center })],
			['A'],
			[radii[1]],
			[radii[1]],
			['0 0 1'],
			[radialPointString(angles[4], radii[0], { center })],
			['Z']
		].join(' ')}
		stroke="white"
		stroke-width={size / 128}
		fill={`hsl(${hue}, ${saturation}%, 25%)`}
	/>
	<circle
		cx={radialPoint(angles[3], radii[3] + eyeRadius, { center }).x}
		cy={radialPoint(angles[3], radii[3] + eyeRadius, { center }).y}
		r={eyeRadius}
		fill="hsl(0, 0%, 0%, 1)"
	/>
	<circle
		cx={radialPoint(angles[3], radii[3] + eyeRadius * φ, { center }).x}
		cy={radialPoint(angles[3], radii[3] + eyeRadius * φ, { center }).y}
		r={Number((eyeRadius * φ ** 2).toFixed(2))}
		fill="white"
	/>
	<path
		d={[
			['M'],
			[radialPointString(angles[12], radii[1], { center })],
			['A'],
			[radii[2]],
			[radii[1]],
			['0 0 1'],
			[radialPointString(angles[6], radii[1], { center })],
			['A'],
			[radii[2]],
			[radii[1]],
			['0 0 1'],
			[radialPointString(angles[12], radii[1], { center })],
			['Z']
		].join(' ')}
		stroke="black"
		stroke-width={size / 128}
		fill={`hsl(${hue}, ${saturation}%, 90%)`}
	/>
	<circle
		cx={radialPoint(angles[9], radii[2] + noseRadius, { center }).x}
		cy={radialPoint(angles[9], radii[2] + noseRadius, { center }).y}
		r={noseRadius}
		fill="hsl(0, 0%, 0%, 1)"
	/>
</g>
