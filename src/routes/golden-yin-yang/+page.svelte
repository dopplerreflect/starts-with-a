<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		circleLineIntersections,
		radialPoint,
		radialPointString,
		starPath,
		viewBox
	} from '$lib/geometry';

	const size = 2 ** 9;
	const r = size / 12;
	const angles = anglesArray(6);
	const circles: Circle[] = angles.map((a) => ({ r: r * 2, ...radialPoint(a, r) }));
	const goldenRadii = circles
		.slice(1, 4)
		.map((c) => circleLineIntersections(c, [{ x: 0, y: 0 }, radialPoint(angles[0] + 30, r * 3)])[0])
		.map((i) => Math.sqrt(i.x ** 2 + i.y ** 2));

	console.log(goldenRadii);
</script>

<DopplerSvg id="golden-yin-yang" viewBox={viewBox(size)}>
	<defs>
		<style>
			#guide {
				/* display: none; */
				stroke: #888;
				fill: none;
			}
		</style>
		<g id="fig">
			{#each circles as c}
				<circle cx={c.x} cy={c.y} r={c.r} />
			{/each}
			{#each goldenRadii as r}
				<circle {r} />
			{/each}
		</g>
	</defs>
	<Background {size} fill="black" />
	<path
		d={`M0 0A${goldenRadii[0]} ${goldenRadii[0]} 0 1 0 ${radialPointString(
			180,
			goldenRadii[0] * 2
		)}A${goldenRadii[0] * 2} ${goldenRadii[0] * 2} 0 1 0 ${radialPointString(
			0,
			goldenRadii[0] * 2
		)}A${goldenRadii[0]} ${goldenRadii[0]} 0 0 1 0 0`}
		stroke="black"
		fill="white"
	/>
	<circle fill="black" r={goldenRadii[2]} cx={-goldenRadii[0]} />
	<circle fill="white" r={goldenRadii[2]} cx={goldenRadii[0]} />
	<circle r={goldenRadii[0] * 2} fill="none" stroke="white" />
	<g id="guide">
		<use href="#fig" transform={`translate(${goldenRadii[0]})`} />
		<use href="#fig" transform={`rotate(180) translate(${goldenRadii[0]}) `} />
	</g>
	<path
		d={starPath(goldenRadii[0], { rotate: -18, center: radialPoint(0, goldenRadii[0]) })}
		stroke="white"
		fill="none"
	/>
	<path
		d={starPath(goldenRadii[0], { rotate: 18, center: radialPoint(0, -goldenRadii[0]) })}
		stroke="black"
		fill="none"
	/>
</DopplerSvg>
