<svelte:options namespace="svg" />

<script lang="ts">
	import { polygonPath, PHI, starPath } from '$lib/geometry';
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="-101 -101 202 202">
	<path d="m-101,-101H101V101H-101Z" fill="black" />
	<path d={starPath(100 * (PHI - 1))} stroke="white" fill="none" />
	<path d={starPath(100 * (PHI - 1) ** 2, { rotate: -36 })} stroke="white" fill="none" />
</svg>
