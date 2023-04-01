<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DrLogo from '$lib/components/DRLogo.svelte';
	import { phi, viewBox } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	let svg: SVGSVGElement;
	const size = 2 ** 10;
	let r = (size / 2) * 0.95;
	let a = 0;
	let d = 0;
	let x = 0;
	let y = 0;

	let path =
		'M' +
		[...Array(4320).keys()]
			.map((k, i) => {
				r = r - size / (360 * 24);
				a = a + 1 / (r / 24);
				d = d > 1 ? 0 : d + 1 / 360;
				x = r * Math.cos(d * (Math.PI * 2));
				y = r * Math.sin(d * (Math.PI * 2)) * phi ** 2;
				return `${x * Math.cos(a * (Math.PI / 180)) + y * Math.sin(a * (Math.PI / 180))} ${
					-x * Math.sin(a * (Math.PI / 180)) + y * Math.cos(a * (Math.PI / 180))
				}`;
			})
			.join('L');

	onMount(() => {
		const unmountZoomable = useZoomableViewbox(svg);
		const unmountSaveFile = useSaveFile(svg);
		return () => {
			unmountZoomable();
			unmountSaveFile();
		};
	});
</script>

<svg bind:this={svg} id="pendulum" viewBox={viewBox(size)}>
	<defs>
		<radialGradient id="gradient0">
			<stop offset="0%" stop-color="hsl(240, 50%, 20%)" />
			<stop offset="120%" stop-color="hsl(225, 100%, 40%)" />
		</radialGradient>
		<radialGradient id="gradient1">
			<stop offset="0%" stop-color="hsl(240, 100%, 66%)" />
			<stop offset="90%" stop-color="hsl(270, 100%, 50%)" />
		</radialGradient>
		<radialGradient id="gradient3">
			<stop offset="0%" stop-color="hsl(240, 100%, 85%)" />
			<stop offset="90%" stop-color="hsl(270, 100%, 75%)" />
		</radialGradient>
	</defs>
	<Background {size} fill="url(#gradient0)" />
	<g id="figure" transform={`rotate(${0})`}>
		<path
			d={path}
			stroke-width="3"
			stroke="url(#gradient1)"
			fill="url(#gradient1)"
			fill-opacity="0.25"
			fill-rule="evenodd"
		/>
	</g>
	<g id="figure" transform={`rotate(${0})`}>
		<path d={path} stroke-width="1" stroke="url(#gradient3)" fill="none" />
	</g>
	<DrLogo
		size={size / 15}
		stroke="hsla(220, 100%, 75%, 0.5)"
		transform={`translate(${size / 2 - size / 20} ${size / 2 - size / 20})`}
	/>
</svg>
