<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, phi, radialPoint, starPath, viewBox } from '$lib/geometry';

	const size = 2 ** 10;
	const r = (size / 2) * 0.85;
	const radii = [r, r * phi, r * phi ** 2, r * phi ** 3, r * phi ** 4];
	const angles = anglesArray(10, 90);
	const lines: Point[][] = angles
		.map((a, i) => [
			[radialPoint(a, radii[0]), radialPoint(angles[(i + 2) % 10], radii[0])],
			[radialPoint(a, radii[0]), radialPoint(angles[(i + 3) % 10], radii[0])],
			[radialPoint(a, radii[0]), radialPoint(angles[(i + 4) % 10], radii[0])],
			[radialPoint(a, radii[1]), radialPoint(angles[(i + 2) % 10], radii[1])],
			[radialPoint(a, radii[1]), radialPoint(angles[(i + 3) % 10], radii[1])],
			[radialPoint(a, radii[1]), radialPoint(angles[(i + 4) % 10], radii[1])],
			[radialPoint(a, radii[2]), radialPoint(angles[(i + 3) % 10], radii[2])],
			[radialPoint(a, radii[2]), radialPoint(angles[(i + 4) % 10], radii[2])],
			[radialPoint(a, radii[3]), radialPoint(angles[(i + 3) % 10], radii[3])],
			[radialPoint(a, radii[3]), radialPoint(angles[(i + 4) % 10], radii[3])],
			[radialPoint(a, radii[4]), radialPoint(angles[(i + 3) % 10], radii[4])],
			[radialPoint(a, radii[4]), radialPoint(angles[(i + 4) % 10], radii[4])],
			[radialPoint(a, radii[0]), { x: 0, y: 0 }]
		])
		.flat();
	const bgRadii: number[] = [];
	for (let r = 10; r <= size * Math.sqrt(2); r += 20) {
		bgRadii.push(r);
	}
</script>

<DopplerSvg id="starfield" viewBox={viewBox(size)}>
	<defs>
		<mask id="circle">
			<Background {size} fill="black" />
			<circle {r} class="mask" fill="white" />
		</mask>
		<filter id="blur">
			<feMorphology in="StrokePaint" operator="dilate" radius="0.5" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="8" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="glow">
			<feMorphology in="StrokePaint" operator="dilate" radius="2" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="3" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<radialGradient id="rgradient">
			<stop offset="80%" stop-color="oklch(0.0 0.25 300 / 0.75)" />
			<stop offset="90%" stop-color="oklch(1 0.37 300 / 0.75)" />
			<stop offset="91%" stop-color="oklch(0.1 0.37 300/ 0.75)" />
			<stop offset="100%" stop-color="oklch(0.0 0.18 300 / 0.0)" />
		</radialGradient>
		<style>
			path:not(.Background),
			circle,
			line {
				stroke: oklch(1 0.15 300);
				fill: none;
			}
			circle.mask {
				fill: white;
			}
			#mask {
				mask: url(#circle);
				filter: url(#blur);
			}
			circle.c {
				fill: oklch(0.2 0.37 300 / 0.2);
				stroke: oklch(1 0.185 60);
			}
			circle.a {
				stroke: oklch(0.5 0.37 300);
			}
			path.border {
				fill: oklch(0.25 0.18 300);
				fill-rule: evenodd;
			}
			#bgCircles circle {
				stroke: oklch(0.5 0.37 300);
			}
			#bgCircles {
				filter: url(#glow);
			}
		</style>
	</defs>
	<Background {size} fill="black" />
	<g id="bgCircles">
		{#each bgRadii as r, i}
			<circle {r} />
		{/each}
	</g>
	<Background {size} fill="url(#rgradient)" />
	<g id="mask">
		{#each radii as r}
			<circle {r} class="c" />
		{/each}
		{#each angles as a}
			<circle
				class="a"
				r={radii[2] - radii[4]}
				cx={radialPoint(a, radii[1]).x}
				cy={radialPoint(a, radii[1]).y}
			/>
			<circle
				class="a"
				r={radii[2]}
				cx={radialPoint(a, radii[1]).x}
				cy={radialPoint(a, radii[1]).y}
			/>
			<circle
				class="a"
				r={radii[1]}
				cx={radialPoint(a, radii[1]).x}
				cy={radialPoint(a, radii[1]).y}
			/>
			<circle
				class="a"
				r={radii[0]}
				cx={radialPoint(a, radii[1]).x}
				cy={radialPoint(a, radii[1]).y}
			/>
		{/each}
		{#each lines as l}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
		{/each}
	</g>
	<path
		class="border"
		d={`M0 ${r + r * phi ** 6}A${r + r * phi ** 6} ${r + r * phi ** 6} 0 1 1 1 ${
			r + r * phi ** 6
		}M0 ${r}A${r} ${r} 0 1 1 1 ${r}Z`}
	/>
</DopplerSvg>
