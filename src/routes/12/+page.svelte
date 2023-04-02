<script lang="ts">
	import { arrayMap, intersection, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';
	import { onMount } from 'svelte';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { useSaveFile } from '$lib/save-svg';
	import PathBuilder from '$lib/components/PathBuilder.svelte';

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountZoomable = useZoomableViewbox(svg);
		const unmountSaveFile = useSaveFile(svg);
		return () => {
			unmountZoomable();
			unmountSaveFile();
		};
	});
	const size = 2 ** 10;
	const r = (size / 2) * 0.95;

	const angles = arrayMap(12, (n) => 30 * n - 90);

	const lines = angles
		.map((a) => [
			[
				[radialPoint(a, r), radialPoint(a + 180, r)],
				...angles
					.slice(4, 10)
					.map((o, i) => [
						radialPoint(i % 2 === 0 ? a : a + 180, r),
						radialPoint(i % 2 === 0 ? a + o : a - o, r)
					])
			]
		])
		.flat(2);

	const paths = lines.map((line) => `M${line[0].x} ${line[0].y}L${line[1].x} ${line[1].y}`);

	const intersections = [
		...new Set(
			lines
				.map((l1, i) =>
					lines.slice(i + 1, lines.length).map((l2, j) => {
						return intersection(l1 as Line, l2 as Line);
					})
				)
				.flat()
				.filter((p) => Math.sqrt(p.x ** 2 + p.y ** 2) <= r)
				.map((i) => JSON.stringify(i))
		)
	].map((s) => JSON.parse(s));

	const radii = [
		...new Set(intersections.map((i) => Math.round(Math.sqrt(i.x ** 2 + i.y ** 2))))
	].sort((a, b) => a - b);

	const iAngles = [
		...new Set(
			intersections.map((i) => Number((Math.atan2(i.x, i.y) * (180 / Math.PI)).toFixed(1)))
		)
	].sort((a, b) => a - b);
</script>

<svg bind:this={svg} id="12" viewBox={viewBox(size)}>
	<Background {size} fill={`hsl(225, 25%, 100%)`} />
	<g stroke-width={size / 2 ** 11} font-size={size / 2 ** 7}>
		<!-- {#each radii as r, i}
			<circle {r} stroke={`hsl(0, 0%, 50%)`} fill="none" />
			<text x={0} y={r}>{i}</text>
		{/each} -->
		{#each paths as path}
			<path d={path} stroke={`hsl(300, 0%, 25%)`} />
		{/each}
		<!-- {#each iAngles as a, i}
			<path d={`M0 0L${radialPointString(a, r)}`} stroke={`hsl(0, 0%, 50%)`} />
			<text
				x={radialPoint(a, r + size / 2 ** 6).x}
				y={radialPoint(a, r + size / 2 ** 6).y}
				text-anchor="middle"
				alignment-baseline="middle"
				fill="black">{i}</text
			>
		{/each} -->
		<PathBuilder angles={iAngles} {radii} stroke="black" />
		{#each intersections as intersection}
			<circle
				cx={intersection.x}
				cy={intersection.y}
				r={(3 * size) / 2 ** 10}
				fill={`hsl(60, 0%, 0%)`}
			/>
		{/each}
	</g>
</svg>
