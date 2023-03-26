<script lang="ts">
	import { radialPoint, polygonPath, radialPointString } from '$lib/geometry';
	import { onMount } from 'svelte';

	export let size = 2 ** 10;
	export let angles: number[] = [];
	export let radii: number[] = [];
	export let rotate: number | null = null;

	let nearestPoint: Point = { x: 0, y: 0 };
	let mouseAngle = 0;
	let mouseRadius = 0;
	let nearestAngle = 0;
	let nearestRadius = 0;
	let pathCode: string[] = [];
	let path = '';

	const pathStrings = ['a', 'c', 'l', 'm', 's', 'q', 'z'];

	function intesectionNearestMouse(event: MouseEvent): {
		nearestPoint: Point;
		nearestAngle: number;
		nearestRadius: number;
		mouseAngle: number;
		mouseRadius: number;
	} {
		let mouse = { x: -size / 2 + event.offsetX, y: -size / 2 + event.offsetY };
		let mouseRadius = Math.sqrt(mouse.x ** 2 + mouse.y ** 2);
		let mouseAngle = -(Math.atan2(mouse.x, mouse.y) * 180) / Math.PI + 90;
		let nearestRadius = radii.reduce((prev, curr) =>
			Math.abs(curr - mouseRadius) < Math.abs(prev - mouseRadius) ? curr : prev
		);
		if (mouse.x > 0 && mouse.y < 0) mouseAngle = 270 + (rotate ? -270 : 90) + mouseAngle;
		let nearestAngle = angles.reduce((prev, curr) =>
			Math.abs(curr - mouseAngle) < Math.abs(prev - mouseAngle) ? curr : prev
		);
		return {
			nearestPoint: radialPoint(nearestAngle, nearestRadius),
			mouseAngle,
			mouseRadius,
			nearestAngle,
			nearestRadius
		};
	}

	function handleMouseMove(event: MouseEvent) {
		({ nearestPoint, nearestAngle, nearestRadius } = intesectionNearestMouse(event));
	}

	function handleMouseDown(event: MouseEvent) {
		pathCode.push(
			`radialPointString(angles[${angles.indexOf(nearestAngle)}], radii[${radii.indexOf(
				nearestRadius
			)}])`
		);
		buildPath();
	}

	function handleKeydown(event: KeyboardEvent) {
		const { key } = event;
		if (pathStrings.includes(key)) {
			pathCode.push(`"${key.toUpperCase()}"`);
		}
		if (key === 'Backspace') {
			pathCode.pop();
		}
		console.log(pathCode.join(','));
		// buildPath();
	}

	let p: SVGPathElement;
	function buildPath() {
		path = eval(`[${pathCode.join(',')}].join(' ')`);
		p.setAttribute('d', path);
		console.log(path);
	}

	onMount(() => {
		function handleWindowResize() {
			window.location.reload();
		}
		window.addEventListener('resize', handleWindowResize);
		document.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('resize', handleWindowResize);
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<g id="PathBuilder">
	<path
		on:mousemove={handleMouseMove}
		on:mousedown={handleMouseDown}
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
	<path bind:this={p} stroke="yellow" fill="none" />
</g>
