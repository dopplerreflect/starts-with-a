<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import { viewBox } from '$lib/geometry';
	import { onMount } from 'svelte';

	let svg: SVGSVGElement;
	const size = 2 ** 10;
	let r = (size / 2) * 0.95;
	let x = 0;
	let y = 0;
	$: pendulum = { x, y };

	onMount(() => {
		let timeout: number;
		function step() {
			console.log(new Date().getMilliseconds());
			timeout = setTimeout(() => {
				step();
			}, 1000 / 60);
		}
		const frame = window.requestAnimationFrame(step);
		return () => {
			window.cancelAnimationFrame(frame);
			clearTimeout(timeout);
		};
	});
</script>

<svg bind:this={svg} id="pendulum" viewBox={viewBox(size)}>
	<Background {size} fill="hsl(45, 25%, 75%)" />
	<circle {r} stroke="black" fill="none" />
	<path id="pendulumVerticalAxis" d={`M${pendulum.x} ${-size}V${size}`} stroke="black" />
	<path id="pendulumHorizontalAxis" d={`M${-size} ${pendulum.y}H${size}`} stroke="black" />
</svg>
