<svelte:options namespace="svg" />

<script lang="ts">
	import { onMount } from 'svelte';
	import { Φ, φ, radialPoint, polygonPath } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import BorderedPath from '$lib/components/BorderedPath.svelte';
	let size = 4096;
	let goldenAngle = 360 / Φ;
	let count = 360;
	let angles = [...Array(count).keys()].map((k) => k * goldenAngle);
	let svg: SVGSVGElement;
	onMount(() => useSaveFile(svg));
</script>

<svg
	id="flower-hexagon"
	bind:this={svg}
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
>
	<path
		d={`M${-size / 2},${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="hsl(240, 100%, 10%)"
	/>
	{#each angles as angle, i}
		<BorderedPath
			d={polygonPath(6, 6 + ((i / (count / 1920)) * φ) / 10, {
				center: {
					x: radialPoint(angle % 360, i / (count / 1920)).x,
					y: radialPoint(angle % 360, i / (count / 1920)).y
				},
				rotate: angle % 360
			})}
			outerColor={`hsl(210, 100%, 50%)`}
			innerColor={`hsl(270, 100%, 60%)`}
			strokeWidth={20.48}
		/>
	{/each}
</svg>
