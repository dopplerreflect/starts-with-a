<svelte:options namespace="svg" />

<script lang="ts">
	import { polygonPath, φ } from '$lib/geometry';
	let digits = [...Array(6).keys()].map((k) => k + 3);
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="-101 -101 202 202">
	<path d="m-101,-101H101V101H-101Z" fill="black" />
	{#each digits as sides}
		<path d={polygonPath(sides, 100 * φ)} stroke="white" fill="none" />
	{/each}
</svg>
