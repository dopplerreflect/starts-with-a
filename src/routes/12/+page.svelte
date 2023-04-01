<script lang="ts">
	import { arrayMap, radialPoint, viewBox } from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';

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
	console.log(lines);
</script>

<svg id="12" viewBox={viewBox(size)}>
	<Background {size} fill={`hsl(225, 25%, 25%)`} />
	{#each paths as path}
		<path d={path} stroke="white" />
	{/each}
</svg>
