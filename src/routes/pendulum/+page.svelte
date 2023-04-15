<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DrLogo from '$lib/components/DRLogo.svelte';
	import { phi, viewBox } from '$lib/geometry';

	const size = 2 ** 10;
	let r = (size / 2) * 0.95;
	let a = 360 * phi;
	let d = 0.26;
	let x = 0;
	let y = 0;

	let path =
		'M' +
		[...Array(2 ** 12).keys()]
			.map((k, i) => {
				r = r - size / (360 * 24);
				a = a + 1 / (r / (size / 64));
				d = d > 1 ? 0 : d + 1 / 120;
				x = r * Math.cos(d * (Math.PI * 2));
				y = r * Math.sin(d * (Math.PI * 2)) * phi ** 2;
				return `${x * Math.cos(a * (Math.PI / 180)) + y * Math.sin(a * (Math.PI / 180))} ${
					-x * Math.sin(a * (Math.PI / 180)) + y * Math.cos(a * (Math.PI / 180))
				}`;
			})
			.join('L');
</script>

<svg id="pendulum" viewBox={viewBox(size)}>
	<defs>
		<radialGradient id="gradient0">
			<stop offset="0%" stop-color="hsl(240, 100%, 20%)" />
			<stop offset="120%" stop-color="hsl(225, 100%, 40%)" />
		</radialGradient>
		<radialGradient id="gradient1">
			<stop offset="0%" stop-color="hsl(240, 100%, 60%)" />
			<stop offset="90%" stop-color="hsl(270, 100%, 50%)" />
		</radialGradient>
		<radialGradient id="gradient2">
			<stop offset="0%" stop-color="hsl(270, 100%, 85%)" />
			<stop offset="90%" stop-color="hsl(300, 100%, 75%)" />
		</radialGradient>
	</defs>
	<Background {size} fill="url(#gradient0)" />
	<g id="figure" transform={`rotate(${0})`}>
		<path
			d={path}
			stroke-width={size / 128}
			stroke="url(#gradient1)"
			fill="none"
			stroke-linecap="round"
		/>
	</g>
	<g id="figure" transform={`rotate(${0})`}>
		<path
			d={path}
			stroke-width={size / 512}
			stroke="url(#gradient2)"
			fill="none"
			stroke-linecap="round"
		/>
	</g>
	<DrLogo
		size={size / 20}
		stroke="hsla(220, 100%, 75%, 0.5)"
		transform={`translate(${size / 2 - size / 20} ${size / 2 - size / 20})`}
	/>
</svg>
