<script lang="ts">
	import { browser } from '$app/environment';
	import Background from '$lib/components/Background.svelte';
	import BorderedPath from '$lib/components/BorderedPath.svelte';
	import PathBuilder from '$lib/components/PathBuilder.svelte';
	import {
		anglesArray,
		arrayMap,
		phi,
		polygonPath,
		radialPoint,
		radialPointString,
		starPath,
		viewBox
	} from '$lib/geometry';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	let size = browser ? Math.min(window.innerHeight, window.innerWidth) : 2 ** 8;
	let angleCount = 60;
	const angles = arrayMap(angleCount, (n) => (360 / angleCount) * n - 90);
	const phiRadii = arrayMap(7, (n) => Math.round((size / 2) * 0.95 * phi ** n));
	const radii = [...new Set([...phiRadii, ...phiRadii.map((r) => phiRadii[0] - r)])].sort(
		(b, a) => a - b
	);

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountZoomable = useZoomableViewbox(svg);
		return () => unmountZoomable();
	});
	let i = 0;
</script>

<svg bind:this={svg} viewBox={viewBox(size)}>
	<Background {size} fill="hsl(240, 50%, 20%)" />

	<PathBuilder {size} {angles} {radii} stroke={'yellow'} />

	{#each radii as r, i}
		<!-- <circle {r} stroke={`hsl(225, 50%, 70%)`} fill="none" /> -->
		<path d={polygonPath(5, r)} stroke={'yellow'} fill="none" />
		<!-- <path d={polygonPath(5, r, { rotate: 36 })} stroke={'yellow'} fill="none" /> -->
	{/each}
	<path d={starPath(radii[0])} stroke="yellow" fill="none" />
	<path d={starPath(radii[8])} stroke="yellow" fill="none" />

	{#each anglesArray(5).map((n) => n * 72) as a, i}
		<!-- <path
		d={starPath(radii[7], { rotate: 72, center: radialPoint(angles[3 + i * 6], radii[5]) })}
		stroke="yellow"
		fill="none"
	/> -->
		<path
			d={starPath(radii[10] - (radii[9] - radii[10]), {
				rotate: 180,
				center: radialPoint(angles[i * 12], radii[1])
			})}
			stroke="yellow"
			fill="none"
		/>
		<path
			d={starPath(radii[9] - radii[10], {
				rotate: 180,
				center: radialPoint(angles[i * 12], radii[2])
			})}
			stroke="yellow"
			fill="none"
		/>
		<path
			d={starPath(radii[10], { rotate: 180, center: radialPoint(angles[i * 12], radii[3]) })}
			stroke="yellow"
			fill="none"
		/>
		<path
			d={starPath(radii[9], { rotate: 180, center: radialPoint(angles[i * 12], radii[4]) })}
			stroke="yellow"
			fill="none"
		/>
		<path
			d={starPath(radii[8], { rotate: 180, center: radialPoint(angles[i * 12], radii[5]) })}
			stroke="yellow"
			fill="none"
		/>
		<path
			d={starPath(radii[7], { rotate: 180, center: radialPoint(angles[i * 12], radii[6]) })}
			stroke="yellow"
			fill="none"
		/>
		<!-- <path
		d={starPath(radii[8], { rotate: 180, center: radialPoint(angles[3 + i * 12], radii[7]) })}
		stroke="yellow"
		fill="none"
	/> -->
		<!-- <path
			transform={`rotate(${a})`}
			d={[
				'M',
				radialPointString(angles[27], radii[2]),
				'L',
				radialPointString(angles[27], radii[1]),
				'A',
				radii[1],
				radii[1],
				'0 0 1',
				radialPointString(angles[29], radii[1]),
				'L',
				radialPointString(angles[29], radii[0]),
				'A',
				radii[0],
				radii[0],
				'0 0 1',
				radialPointString(angles[1], radii[0]),
				'L',
				radialPointString(angles[1], radii[1]),
				'A',
				radii[1],
				radii[1],
				'0 0 1',
				radialPointString(angles[3], radii[1]),
				'L',
				radialPointString(angles[3], radii[2]),
				'A',
				radii[2],
				radii[2],
				'0 0 0',
				radialPointString(angles[27], radii[2]),
				'Z',
				'C'
			].join(' ')}
			stroke="yellow"
			fill="none"
		/> -->
	{/each}
</svg>
