<script lang="ts">
	import { browser } from '$app/environment';
	import Background from '$lib/components/Background.svelte';
	import {
		arrayMap,
		phi,
		radialPointString,
		viewBox,
		intesectionNearestMouse
	} from '$lib/geometry';
	import { onMount } from 'svelte';

	let size = browser ? Math.min(window.innerHeight, window.innerWidth) : 2 ** 8;
	let nearestAngle = 0;
	let nearestRadius = 0;
	let nearestPoint: Point = { x: 0, y: 0 };

	let fill = 'hsl(220, 50%, 50%)';

	const angles = arrayMap(30, (n) => (360 / 30) * n);
	const radii = arrayMap(5, (n) => Math.round((size / 2) * phi ** n));

	function handleMouseMove(event: MouseEvent) {
		let i = intesectionNearestMouse(event, size, angles, radii);
		nearestPoint = i.nearestPoint;
		nearestAngle = i.nearestAngle;
		nearestRadius = i.nearestRadius;
	}

	onMount(() => {
		function handleWindowResize() {
			window.location.reload();
		}
		window.addEventListener('resize', handleWindowResize);
		return () => window.removeEventListener('resize', handleWindowResize);
	});
</script>

<svg on:mousemove={handleMouseMove} viewBox={viewBox(size)}>
	<Background {size} {fill} />
	{#each radii as r, i}
		<circle {r} stroke="white" fill="none" />
	{/each}
	{#each angles as a, i}
		<path
			d={`M${radialPointString(a, radii[0])}L${radialPointString(a, radii[radii.length - 1])}`}
			stroke="white"
		/>
	{/each}
	<!-- <circle r={nearestRadius} stroke="yellow" fill="none" /> -->
	<!-- <path d={`M0 0L${radialPointString(nearestAngle, nearestRadius)}`} stroke="yellow" /> -->
	<circle r={2} cx={nearestPoint.x} cy={nearestPoint.y} stroke="red" fill="none" />
</svg>
