<svelte:options namespace="svg" />

<script lang="ts">
	import { polygonPath, PHI, starPath } from '$lib/geometry';
	import BorderedPath from '$lib/components/BorderedPath.svelte';
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="-101 -101 202 202">
	<path d="m-101,-101H101V101H-101Z" fill="black" />
	<circle r={100} stroke="white" fill="none" />
	<path d={starPath(100 * (PHI - 1))} stroke="white" fill="none" />
	<path d={starPath(100 * (PHI - 1) ** 2, { rotate: -36 })} stroke="white" fill="none" />
	<path
		d={starPath(100 * (PHI - 1) ** 3, { rotate: -36 })}
		stroke="white"
		fill="none"
		stroke-linejoin="bevel"
	/>
	<BorderedPath d={starPath(100)} innerColor="hsl(255, 100%, 50%)" />
</svg>
