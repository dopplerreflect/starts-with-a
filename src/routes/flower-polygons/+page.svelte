<svelte:options namespace="svg" />

<script lang="ts">
	import { onMount } from 'svelte';
	import { Φ, radialPoint, polygonPath } from '$lib/geometry';
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
	id="flower-polygons"
	bind:this={svg}
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
>
	<path
		d={`M${-size / 2},${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="hsl(270, 100%, 10%)"
	/>
	{#each angles as angle, i}
		<BorderedPath
			d={polygonPath((i % 6) + 3, 1 + 0.4 * i, {
				center: {
					x: radialPoint(angle, i / (count / 2048)).x,
					y: radialPoint(angle, i / (count / 2048)).y
				},
				rotate: angle
			})}
			outerColor={`hsl(0, 100%, 50%)`}
			innerColor={`hsl(60, 100%, 50%)`}
			strokeWidth={size / 200}
		/>
	{/each}
</svg>
