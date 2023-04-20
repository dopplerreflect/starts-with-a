<script lang="ts">
	import { SQRT3, polygonPath, viewBox } from '$lib/geometry';

	export let size = 2 ** 10;
	export let r = size / 80;
	export let gap = size / 160;
	export let fill = 'white';
	export let stroke: string | null = null;
	export let strokeWidth = 0;
	export let strokeOpacity = 1;
	export let filter = '';
	export let circular = false;

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

	function isInCircle(radius: number, point: Point, centerX = 0, centerY = 0) {
		let squareDist = (centerX - point.x) ** 2 + (centerY - point.y) ** 2;
		return squareDist <= radius ** 2;
	}

	let hexCenterPoints: Point[] = y_offsets
		.map((y, row) =>
			x_offsets.map((x) => ({
				x: row % 2 === 0 ? x + (r / 2) * SQRT3 + gap / 2 : x,
				y: y
			}))
		)
		.flat()
		.filter((p) => (circular ? isInCircle(size / 4, p) : p));
</script>

<g {fill} {stroke} stroke-width={strokeWidth} stroke-opacity={strokeOpacity} {filter}>
	{#each hexCenterPoints as center}
		<path d={polygonPath(6, r, { center })} />
	{/each}
</g>
