<svelte:options namespace="svg" />

<script lang="ts">
	import { viewBox } from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';
	import CarbonFiberPattern from '$lib/components/CarbonFiberPattern.svelte';

	const size = 2 ** 13;
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<CarbonFiberPattern {size} scale={0.075} />
	</defs>
	<Background {size} fill="url(#CarbonFiberPattern)" />
</svg>
