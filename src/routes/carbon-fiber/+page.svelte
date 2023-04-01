<svelte:options namespace="svg" />

<script lang="ts">
	import { phi, viewBox } from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';
	import CarbonFiberPattern from '$lib/components/CarbonFiberPattern.svelte';
	import DrLogo from '$lib/components/DRLogo.svelte';

	const size = 2 ** 13;
	const bgsize = Math.sqrt(size ** 2 * 2);
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<CarbonFiberPattern size={bgsize} scale={0.05} />
	</defs>
	<Background size={bgsize} transform="rotate(45)" fill="url(#CarbonFiberPattern)" />
	<DrLogo size={size * phi} stroke={`hsl(0, 0%, 0%)`} strokeOpacity={0.66} />
</svg>
