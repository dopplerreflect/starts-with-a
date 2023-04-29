<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import {
		Phi,
		anglesArray,
		arrayMap,
		circleIntersections,
		multiCircleIntersections,
		phi,
		pointToString,
		radialPoint,
		viewBox
	} from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountZoom = useZoomableViewbox(svg, 0);
		const unmountSave = useSaveFile(svg, { timestamp: true });
		return () => {
			unmountZoom();
			unmountSave();
		};
	});

	const size = 2 ** 10;
	const r = size / 40;

	const ri = arrayMap(7, (n) => n).map((n, i) => ({ r: r * Phi ** n, x: 0, y: 0 }));

	type CircleWithClass = Circle & { class?: string };

	const circles: CircleWithClass[] = anglesArray(6)
		.map((a) => [
			{ r: ri[0].r, ...radialPoint(a, ri[2].r) },
			{ r: ri[1].r, ...radialPoint(a, ri[2].r) },
			{ r: ri[1].r, ...radialPoint(a, ri[3].r) },
			{ r: ri[2].r, ...radialPoint(a, ri[3].r) },
			{ r: ri[2].r, ...radialPoint(a, ri[4].r) },
			{ r: ri[3].r, ...radialPoint(a, ri[4].r) },
			{ r: ri[3].r, ...radialPoint(a, ri[5].r) },
			{ r: ri[4].r, ...radialPoint(a, ri[5].r) },
			{ r: ri[3].r, ...radialPoint(a, ri[2].r), class: 'light' },
			{ r: ri[4].r, ...radialPoint(a, ri[4].r), class: 'light' },
			{ r: ri[5].r, ...radialPoint(a, ri[4].r), class: 'light' }
		])
		.flat();

	const intersections = multiCircleIntersections(circles);

	function intersectionClick(i: number) {
		console.log(i);
	}
</script>

<svg id="phihex" bind:this={svg} viewBox={viewBox(size)}>
	<defs>
		<HexPattern
			size={r / Math.sqrt(7)}
			stroke="oklch(0.30 0.18 270)"
			strokeWidth={4}
			id="hexpattern"
			patternTransform="rotate(0)"
		/>
		<radialGradient id="redGlow">
			<stop offset={0} stop-color="oklch(0.33 0.18 60 / 1)" />
			<stop offset={phi} stop-color="oklch(0.25 0.18 270 / 1)" />
		</radialGradient>
		<linearGradient id="bottomLight" gradientTransform="rotate(90)">
			<stop offset={0} stop-color="oklch(0.5 0.37 30 / 0)" />
			<stop offset={1} stop-color="oklch(1 0.37 30 / 0.25)" />
		</linearGradient>
		<style>
			circle {
				fill: none;
				stroke: oklch(0.75 0.27 90);
				stroke-width: 2;
				/* fill: url(#redGlow); */
			}
			circle.light {
				stroke: oklch(0.75 0.18 270);
			}
			circle.dark {
				stroke: oklch(0.5 0.5 270);
			}
			circle.intersection {
				stroke: none;
				fill: white;
			}
			path.thick {
				display: none;
				stroke: white;
				stroke-width: 4;
				fill: none;
				stroke-linecap: round;
			}
			#intersections {
				/* display: none; */
			}
		</style>
	</defs>
	<Background {size} fill="url(#redGlow)" />
	<Background {size} fill="url(#hexpattern)" />
	<Background {size} fill="url(#bottomLight)" />

	{#each anglesArray(6, 0) as a, i}
		<g transform={`rotate(${a})`}>
			<path
				class="thick"
				d={`M${pointToString(intersections[17])}A${ri[0].r} ${ri[0].r} 0 1 1 ${pointToString(
					intersections[7]
				)}A${ri[1].r} ${ri[1].r} 0 0 0 ${pointToString(intersections[429])}`}
			/>
			<path
				class="thick"
				d={`M${pointToString(intersections[611])}A${ri[1].r} ${ri[1].r} 0 1 1 ${pointToString(
					intersections[489]
				)}A${ri[2].r} ${ri[2].r} 0 0 0 ${pointToString(intersections[759])}`}
			/>
		</g>
	{/each}

	{#each circles.filter((c) => c.class === undefined) as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} class={c.class} />
	{/each}
	{#each circles.filter((c) => c.class === 'light') as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} class={c.class} />
	{/each}

	<g id="intersections">
		{#each intersections as intersection, i}
			<circle
				class="intersection"
				on:click={() => intersectionClick(i)}
				on:keydown={() => {}}
				r={circles[0].r * phi ** 5}
				cx={intersection.x}
				cy={intersection.y}
			/>
		{/each}
	</g>
</svg>
