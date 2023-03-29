<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import { phi, radialPointString, viewBox } from '$lib/geometry';
	import { onMount } from 'svelte';

	let svg: SVGSVGElement;
	const size = 2 ** 10;
	let r = (size / 2) * 0.95;
	let d = 0;
	$: x = r * Math.cos(d * (Math.PI * 2));
	$: y = r * Math.sin(d * (Math.PI * 2)) * phi ** 2;
	// let y = r * phi ** 2;
	let a = 0;
	$: pendulum = { x, y };
	let points: Point[] = [];
	let path: string;
	onMount(() => {
		let timeout: number;
		function step() {
			points = [
				...points,
				{
					x:
						pendulum.x * Math.cos(a * (Math.PI / 180)) + pendulum.y * Math.sin(a * (Math.PI / 180)),
					y:
						-pendulum.x * Math.sin(a * (Math.PI / 180)) + pendulum.y * Math.cos(a * (Math.PI / 180))
				}
			];
			path = `M${[...points.map((p) => `${p.x} ${p.y}`)].join('L')}`;
			console.log(path);
			timeout = setTimeout(() => {
				d = d > 1 ? 0 : d + 1 / 24;
				a = a > 360 ? 0 : a + 1 / (r / 24);
				r = r - size / (360 * 24);
				if (a <= 360) step();
			}, 0);
		}
		step();
		const frame = window.requestAnimationFrame(step);
		return () => {
			window.cancelAnimationFrame(frame);
			clearTimeout(timeout);
		};
	});
</script>

<svg bind:this={svg} id="pendulum" viewBox={viewBox(size)}>
	<defs>
		<radialGradient id="gradient">
			<stop offset="0%" stop-color="red" />
			<stop offset="90%" stop-color="yellow" />
		</radialGradient>
	</defs>
	<Background {size} fill="hsl(220, 25%, 20%)" />
	<g id="figure" transform={`rotate(${a})`}>
		<path d={path} stroke="url(#gradient)" fill="none" fill-rule="evenodd" />
	</g>
</svg>
