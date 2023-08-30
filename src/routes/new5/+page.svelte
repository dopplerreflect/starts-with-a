<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import { Phi, SQRT3, anglesArray, phi, polygonPath, radialPoint, viewBox } from '$lib/geometry';

	const size = 2 ** 10;
	const r = size / 16;
	const radii = [r, r * Phi, r * Phi ** 2];
	const angles = anglesArray(6, 0);
	type CircleWithClass = Circle & { class?: string };
	const circles: CircleWithClass[] = [
		...angles
			.map((a) => radii.map((r, i) => ({ class: `r${i}`, r, ...radialPoint(a, radii[2]) })))
			.flat(),
		...angles
			.map((a) => radii.map((r, i) => ({ class: `r${i}`, r, ...radialPoint(a, radii[2] * 2) })))
			.flat(),
		...angles
			.map((a) =>
				radii.map((r, i) => ({ class: `r${i}`, r, ...radialPoint(a + 30, radii[2] * SQRT3) }))
			)
			.flat(),
		...radii.map((r, i) => ({ class: `r${i}`, r, x: 0, y: 0 }))
	];
</script>

<DopplerSvg viewBox={viewBox(size)} id="new5">
	<defs>
		<style>
			circle,
			line {
				stroke: white;
				fill: none;
			}
			.r0 {
				stroke: oklch(1 0.37 90);
			}
			.r1 {
				stroke: oklch(1 0.37 180);
			}
			.r2 {
				stroke: oklch(1 0.37 270);
			}
		</style>
		<filter id="blur">
			<feMorphology in="SourceGraphic" operator="dilate" radius=".618" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="6.85" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<HexPattern
			id="hex"
			size={r * phi ** 2}
			patternTransform="rotate(30)"
			stroke="oklch(0.5 0.37 270)"
		/>
		<HexPattern
			id="hex2"
			size={(r * phi ** 2) / 2}
			patternTransform="rotate(30)"
			stroke="oklch(0.25 0.37 200)"
		/>
		<HexPattern
			id="hex3"
			size={(r * phi ** 2) / 4}
			patternTransform="rotate(30)"
			stroke="oklch(0.125 0.37 270)"
		/>
	</defs>
	<Background {size} fill="black" />
	<Background {size} fill="url(#hex3)" filter="url(#blur)" />
	<Background {size} fill="url(#hex2)" filter="url(#blur)" />
	<Background {size} fill="url(#hex)" filter="url(#blur)" />
	<g id="figure" filter="url(#blur)">
		{#each circles as c, i}
			<circle class={c.class} id={`c${i}`} r={c.r} cx={c.x} cy={c.y} />
		{/each}
	</g>
</DopplerSvg>
