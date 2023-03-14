<script lang="ts">
	import { Φ, φ, radialPoint } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { onMount } from 'svelte';
	import RaccoonFace from './raccoonFace.svelte';
	const size = 8092;
	const count = 360;
	const angles = [...Array(count).keys()].map((k) => k * (360 * φ));
	const hues = { start: 330, end: 180 };
	function hue(i: number) {
		return Math.floor(hues.start - Math.abs(((hues.start - hues.end) / count) * i));
		// return (i % 8) * ((hues.end - hues.start) / 8) + hues.start;
	}
	let svg: SVGSVGElement;
	onMount(() => useSaveFile(svg));
</script>

<svg
	bind:this={svg}
	id="raccoonFace"
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
>
	<path
		d={`M${-size / 2},${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="hsl(0, 0%, 100%)"
	/>
	{#each angles as a, i}
		<RaccoonFace
			size={i < 15 ? size / 80.92 : size / 80.92 + i * (size / Φ ** 17.3)}
			rotate={a + 90}
			center={radialPoint(a, (size / 1.4 / count) * i)}
			hue={hue(i)}
		/>
	{/each}
	<g style="opacity: 1">
		<RaccoonFace size={size / 6} rotate={0} center={{ x: 0, y: 0 }} hue={45} saturation={15} />
	</g>
</svg>
