<script lang="ts">
	import { browser } from '$app/environment';
	import Background from '$lib/components/Background.svelte';
	import { arrayMap, phi, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import { onMount } from 'svelte';

	let size = browser ? Math.min(window.innerHeight, window.innerWidth) : 2 ** 8;
	let r = 0;
	let a = 0;
	let closestAngle = 0;
	let closestRadius = 0;

	let fill = 'hsl(220, 50%, 50%)';

	const angles = arrayMap(48, (n) => (360 / 48) * n);
	const radii = arrayMap(8, (n) => Math.round((size / 2) * phi ** n));

	const intersections = angles
		.map((a, ai) => [...radii.map((r, ri) => radialPoint(angles[ai], radii[ri]))])
		.flatMap((p) => p);

	let mouse: Point | null = null;
	function handleMouseMove(event: MouseEvent) {
		mouse = { x: -size / 2 + event.offsetX, y: -size / 2 + event.offsetY };
		r = Math.sqrt(mouse.x ** 2 + mouse.y ** 2);
		closestRadius = radii.reduce((prev, curr) =>
			Math.abs(curr - r) < Math.abs(prev - r) ? curr : prev
		);
		a = -(Math.atan2(mouse.x, mouse.y) * 180) / Math.PI + 90;
		if (mouse.x > 0 && mouse.y < 0) a = 270 + 90 + a;
		closestAngle = angles.reduce((prev, curr) =>
			Math.abs(curr - a) < Math.abs(prev - a) ? curr : prev
		);
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
		<!-- <text x={radialPoint(a, radii[0]).x} y={radialPoint(a, radii[0]).y} fill="white" font-size="2em"
			>{a}</text
		> -->
	{/each}
	<!-- {#each intersections as intersection, i}
		<text
			x={intersection.x}
			y={intersection.y}
			font-size="0.75em"
			fill="white"
			text-anchor="middle"
			alignment-baseline="middle">{i}</text
		>
	{/each} -->
	{#if mouse}
		<circle cx={mouse.x} cy={mouse.y} r={10} stroke="white" fill="none" />
		<circle {r} stroke="yellow" fill="none" />
		<path d={`M0 0L${radialPointString(a, r)}`} stroke="yellow" />
		<!-- <text x={mouse.x} y={mouse.y} font-size="3em" fill="yellow">{Math.round(a)}</text> -->
	{/if}
	<circle r={closestRadius} stroke="red" fill="none" />
	<path d={`M0 0L${radialPointString(closestAngle, radii[0])}`} stroke="red" />
</svg>
