<script lang="ts">
	import { SQRT3, polygonPath, viewBox } from '$lib/geometry';

	export let size = 2 ** 10;
	export let r = size / 80;
	export let gap = size / 160;
	export let fill = 'white';
	export let stroke: string | null = null;
	export let strokeWidth = 0;

	let y_offsets: number[] = [];
	let x_offsets: number[] = [];

	for (let y = 0; y <= size / 2 + r + gap; y += 1.5 * r + gap * (SQRT3 / 2)) {
		if (y > 0) y_offsets.push(-y);
		y_offsets.push(y);
	}
	for (let x = 0; x <= size / 2 + r + gap; x += r * SQRT3 + gap) {
		if (x > 0) x_offsets.push(-x);
		x_offsets.push(x);
	}
	y_offsets.sort((a, b) => a - b);
	x_offsets.sort((a, b) => a - b);
</script>

{#each y_offsets as y, row}
	{#each x_offsets as x}
		<path
			d={polygonPath(6, r, {
				center: { x: row % 2 === 0 ? x + (r / 2) * SQRT3 + gap / 2 : x, y: y }
			})}
			{fill}
			{stroke}
			stroke-width={strokeWidth}
		/>
	{/each}
{/each}
