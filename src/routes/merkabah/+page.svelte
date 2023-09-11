<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { SQRT3, anglesArray, pythag, radialPoint, radialPointString, tan } from '$lib/geometry';
	const size = 2 ** 10;
	const r = 100;
	const vesica = r * SQRT3;
	const angles = anglesArray(6);
	const circles: Circle[] = [
		{ r, x: 0, y: 0 },
		...angles.map((a) => ({ r, ...radialPoint(a, r) })),
		...angles.map((a) => ({ r, ...radialPoint(a, r * 2) })),
		...angles.map((a) => ({ r, ...radialPoint(a - 30, r * SQRT3) })),
		...angles.map((a) => ({ r, ...radialPoint(a, r * 3) })),
		...angles.map((a) => ({
			r,
			...radialPoint(a + tan(vesica, r * 2), pythag(vesica / 2, r * 2.5))
		})),
		...angles.map((a) => ({
			r,
			...radialPoint(a - tan(vesica, r * 2), pythag(vesica / 2, r * 2.5))
		})),
		...angles.map((a) => ({ r, ...radialPoint(a, r * 4) })),
		...angles.map((a) => ({ r, ...radialPoint(a - 30, r * SQRT3 * 2) })),
		...angles.map((a) => ({
			r,
			...radialPoint(a + tan(vesica / 2, r * 3.5), pythag(vesica / 2, r * 3.5))
		})),
		...angles.map((a) => ({
			r,
			...radialPoint(a - tan(vesica / 2, r * 3.5), pythag(vesica / 2, r * 3.5))
		}))
	];
	const paths = [
		[
			radialPointString(angles[1], r * 4),
			radialPointString(angles[3], r * 4),
			radialPointString(angles[5], r * 4)
		]
	].map((p) => `M${p.join(' ')}Z`);
</script>

<DopplerSvg {size} id="merkabah">
	<defs>
		<filter id="glow">
			<feMorphology in="SourceGraphic" operator="dilate" radius="1" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="8" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="black" />
	<g id="circles">
		{#each circles as c}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				stroke={`oklch(0.5 0.37 ${200 + Math.sqrt(c.x ** 2 + c.y ** 2) * ((r * 4) / 1800)})`}
			/>
		{/each}
	</g>

	{#each paths as d, i}
		<path {d} />
	{/each}
</DopplerSvg>

<style>
	circle,
	path {
		fill: none;
	}
	path {
		stroke: white;
	}
	#circles {
		filter: url(#glow);
	}
</style>
