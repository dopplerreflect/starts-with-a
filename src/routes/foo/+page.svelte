<svelte:options namespace="svg" />

<script lang="ts">
	import { polygonPath, PHI } from '$lib/geometry';
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="-101 -101 202 202">
	<path d="m-101,-101H101V101H-101Z" fill="black" />
	<path d={polygonPath(4, 100 * (PHI - 1), { rotate: 45 })} stroke="white" />
</svg>
