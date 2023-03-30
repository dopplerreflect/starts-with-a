<svelte:options namespace="svg" />

<script lang="ts">
	import { viewBox } from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';
	import CarbonFiberPattern from '$lib/components/CarbonFiberPattern.svelte';

	const size = 2 ** 13;
	const bgsize = Math.sqrt(size ** 2 * 2);
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<CarbonFiberPattern size={bgsize} scale={0.05} />
	</defs>
	<Background size={bgsize} transform={'rotate(45)'} fill="url(#CarbonFiberPattern)" />
</svg>
