<script lang="ts">
	import { radialPoint, polygonPath, radialPointString } from '$lib/geometry';
	import { onMount } from 'svelte';

	export let size = 2 ** 10;
	export let angles: number[] = [];
	export let radii: number[] = [];

	let nearestPoint: Point = { x: 0, y: 0 };
	let nearestAngle = 0;
	let nearestRadius = 0;

	function intesectionNearestMouse(event: MouseEvent): {
		nearestPoint: Point;
		nearestAngle: number;
		nearestRadius: number;
	} {
		let mouse = { x: -size / 2 + event.offsetX, y: -size / 2 + event.offsetY };
		let nearestRadius = Math.sqrt(mouse.x ** 2 + mouse.y ** 2);
		let nearestAngle = -(Math.atan2(mouse.x, mouse.y) * 180) / Math.PI + 90;
		let closestRadius = radii.reduce((prev, curr) =>
			Math.abs(curr - nearestRadius) < Math.abs(prev - nearestRadius) ? curr : prev
		);
		if (mouse.x > 0 && mouse.y < 0) nearestAngle = 270 + 90 + nearestAngle;
		let closestAngle = angles.reduce((prev, curr) =>
			Math.abs(curr - nearestAngle) < Math.abs(prev - nearestAngle) ? curr : prev
		);
		return { nearestPoint: radialPoint(closestAngle, closestRadius), nearestAngle, nearestRadius };
	}

	function handleMouseMove(event: MouseEvent) {
		({ nearestPoint, nearestAngle, nearestRadius } = intesectionNearestMouse(event));
	}

	onMount(() => {
		function handleWindowResize() {
			window.location.reload();
		}
		window.addEventListener('resize', handleWindowResize);
		return () => window.removeEventListener('resize', handleWindowResize);
	});
</script>

<g id="PathBuilder">
	<path
		on:mousemove={handleMouseMove}
		d={`M${-size / 2} ${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="hsla(0, 50%, 50%, 0.0)"
	/>
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
	<path
		d={polygonPath(4, size / 100, {
			center: { x: nearestPoint.x, y: nearestPoint.y },
			rotate: nearestAngle
		})}
		stroke="yellow"
		fill="white"
	/>
</g>
