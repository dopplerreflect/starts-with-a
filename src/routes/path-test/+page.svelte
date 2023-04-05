<script lang="ts">
	import { arrayMap, phi, viewBox } from '$lib/geometry';
	import { pathFromDSL } from '$lib/path-parser';

	const size = 2 ** 6;
	const r = (size / 2) * 0.9;
	const angles = arrayMap(4, (n) => n * 90 - 90);
	const radii = arrayMap(5, (n) => r * phi ** n);

	const parse = pathFromDSL(angles, radii);
</script>

<svg viewBox={viewBox(size)}>
	<path d={parse('M0 0L0 2A2 2 0 0 0 3 2L3 0A0 0 0 0 1 0 0Z')} stroke="white" />
</svg>
