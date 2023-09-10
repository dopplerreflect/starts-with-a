<script lang="ts">
	import { midpoint } from '$lib/geometry';

	export let lineArray: Line[];
	export let name: string;
</script>

{#each lineArray as l, i}
	<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} class={name} />
	<text x={midpoint(l).x} y={midpoint(l).y}>{`${name}${i}`}</text>
{/each}
