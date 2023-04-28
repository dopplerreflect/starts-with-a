<script lang="ts">
	import { SQRT3 } from '$lib/geometry';
	export let id: string,
		size = 2 ** 6,
		stroke = 'white',
		strokeWidth = 1,
		patternTransform: string | null = null;

	const psize = size * 3;
</script>

<pattern {id} {patternTransform} width={psize} height={psize / SQRT3} patternUnits="userSpaceOnUse">
	<g fill="none" stroke="#808" stroke-width="15">
		<path
			{stroke}
			stroke-width={strokeWidth}
			d={`M${psize / 1.5} 0H${psize / 3}L${psize / 6} ${psize / SQRT3 / 2}l${psize / 6} ${
				psize / SQRT3 / 2
			}h${psize / 3}l${psize / 6}-${psize / SQRT3 / 2}zM0 ${psize / SQRT3 / 2}H${psize / 6}M${
				psize - psize / 6
			} ${psize / SQRT3 / 2}h${psize / 6}`}
		/>
	</g>
</pattern>
