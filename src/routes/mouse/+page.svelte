<script lang="ts">
	import { browser } from '$app/environment';
	import Background from '$lib/components/Background.svelte';
	import { arrayMap, phi, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import { onMount } from 'svelte';

	let size = browser ? Math.min(window.innerHeight, window.innerWidth) : 2 ** 8;
	let r = 0;
	let a = 0;
	// let closestAngle = 0;
	// let closestRadius = 0;
	let closestIntersection: Point = { x: 0, y: 0 };

	let fill = 'hsl(220, 50%, 50%)';

	const angles = arrayMap(108, (n) => (360 / 108) * n);
	const radii = arrayMap(10, (n) => Math.round((size / 2) * phi ** (n * 0.5)));

	// const intersections = angles
	// 	.map((a, ai) => [...radii.map((r, ri) => radialPoint(angles[ai], radii[ri]))])
	// 	.flatMap((p) => p);

	function intesectionNearestMouse(
		mouse: { x: number; y: number },
		angles: number[],
		radii: number[]
	) {
		let closestRadius = radii.reduce((prev, curr) =>
			Math.abs(curr - r) < Math.abs(prev - r) ? curr : prev
		);
		if (mouse.x > 0 && mouse.y < 0) a = 270 + 90 + a;
		let closestAngle = angles.reduce((prev, curr) =>
			Math.abs(curr - a) < Math.abs(prev - a) ? curr : prev
		);
		return radialPoint(closestAngle, closestRadius);
	}

	function handleMouseMove(event: MouseEvent) {
		let mouse = { x: -size / 2 + event.offsetX, y: -size / 2 + event.offsetY };
		r = Math.sqrt(mouse.x ** 2 + mouse.y ** 2);
		a = -(Math.atan2(mouse.x, mouse.y) * 180) / Math.PI + 90;
		closestIntersection = intesectionNearestMouse(mouse, angles, radii);
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
	<circle {r} stroke="yellow" fill="none" />
	<path d={`M0 0L${radialPointString(a, r)}`} stroke="yellow" />
	<circle r={10} cx={closestIntersection.x} cy={closestIntersection.y} stroke="red" fill="none" />
</svg>
