<svelte:options namespace="svg" />

<script lang="ts">
	import { anglesArray, circleLineIntersections as cli, radialPoint, viewBox } from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';
	const size = 2 ** 9;
	const r = size / 12;
	const radii = [2, 4].map((n) => n * r);
	const angles = anglesArray(6);
	const circles: Circle[] = radii
		.map((lr) => angles.map((a) => ({ r, ...radialPoint(a, lr) })))
		.flat();
	const i = [
		cli(circles[6], [radialPoint(angles[0], radii[1]), radialPoint(angles[1], radii[1])])[0],
		cli(circles[8], [radialPoint(angles[1], radii[1]), radialPoint(angles[2], radii[1])])[0],
		cli(circles[9], [radialPoint(angles[3], radii[1]), radialPoint(angles[4], radii[1])])[0],
		cli(circles[11], [radialPoint(angles[4], radii[1]), radialPoint(angles[5], radii[1])])[0],
		cli(circles[1], [{ x: 0, y: 0 }, radialPoint(angles[1], radii[0])])[0],
		cli(circles[4], [{ x: 0, y: 0 }, radialPoint(angles[4], radii[0])])[0]
	].map((i) => `${i.x} ${i.y}`);
	const parse = pathFromDSL(angles, radii);
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<style>
			path,
			circle {
				stroke: hsl(0, 0%, 20%);
				fill-opacity: 0.25;
			}
			path {
				stroke-linecap: round;
				stroke-linejoin: round;
			}
			g.rear path {
				stroke-dasharray: 3;
			}
			g.cube path {
				stroke: hsl(270, 100%, 50%);
				fill: hsl(270, 50%, 50%);
			}
			g.octahedron path {
				stroke: hsl(120, 100%, 50%);
				fill: hsl(120, 50%, 50%);
			}
		</style>
	</defs>
	<circle {r} />
	{#each circles as c}
		<circle r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<g class="cube rear">
		<path d={'M0 0' + parse('L0 1L1 1L2 1Z')} />
		<path d={'M0 0' + parse('L0 1L5 1L4 1Z')} />
		<path d={'M0 0' + parse('L2 1L3 1L4 1Z')} />
	</g>
	<g class="octahedron rear">
		<path d={`M${i[0]}L${i[1]}L${i[5]}Z`} />
		<path d={`M${i[1]}L${i[2]}L${i[5]}Z`} />
		<path d={`M${i[2]}L${i[3]}L${i[5]}Z`} />
		<path d={`M${i[3]}L${i[0]}L${i[5]}Z`} />
	</g>
	<g class="octahedron front">
		<path d={`M${i[1]}L${i[2]}L${i[4]}Z`} />
		<path d={`M${i[2]}L${i[3]}L${i[4]}Z`} />
		<path d={`M${i[0]}L${i[1]}L${i[4]}Z`} />
		<path d={`M${i[3]}L${i[0]}L${i[4]}Z`} />
	</g>
	<g class="cube front">
		<path d={'M0 0' + parse('L1 1L2 1L3 1Z')} />
		<path d={'M0 0' + parse('L1 1L0 1L5 1Z')} />
		<path d={'M0 0' + parse('L3 1L4 1L5 1Z')} />
	</g>
</svg>
