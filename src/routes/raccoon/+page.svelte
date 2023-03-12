<script lang="ts">
	import { φ, radialPoint, radialPointString } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { onMount } from 'svelte';
	import RaccoonFace from './raccoonFace.svelte';
	const size = 4096;
	let count = 360;
	const angles = [...Array(count).keys()].map((k) => k * (360 * φ));
	console.log(angles);
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
		fill="hsl(0, 0%, 5%)"
	/>
	<!-- <RaccoonFace size={512} rotate={90} center={{ x: 100, y: 100 }} /> -->
	{#each angles as a, i}
		<RaccoonFace
			size={i < 15 ? 100 : 100 + i * 1.25}
			rotate={a + 90}
			center={radialPoint(a, (size / count) * i)}
			hue={180 + i / 1.75}
		/>
	{/each}
</svg>
