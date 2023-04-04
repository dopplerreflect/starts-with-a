<script lang="ts">
	import { arrayMap, intersection, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';
	import { onMount } from 'svelte';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { useSaveFile } from '$lib/save-svg';
	import PathBuilder from '$lib/components/PathBuilder.svelte';
	import DrLogo from '$lib/components/DRLogo.svelte';

	let hue = 0;
	let saturation = 50;

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
	const angles6 = arrayMap(6, (n) => n * 60);

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
	].sort((a, b) => b - a);

	const iAngles = [
		...new Set(
			intersections.map((i) => Number((Math.atan2(i.x, i.y) * (180 / Math.PI)).toFixed(1)))
		)
	].sort((a, b) => a - b);
</script>

<svg bind:this={svg} id="12" viewBox={viewBox(size)}>
	<defs>
		<g id="twelveth" stroke="white" stroke-width={size / 2 ** 11} fill-opacity="0.5">
			<path
				id="innerpoint"
				d={[
					'M',
					radialPointString(iAngles[35], radii[15]),
					'Q',
					radialPointString(iAngles[35], radii[16]),
					radialPointString(iAngles[41], radii[17]),
					'L',
					radialPointString(iAngles[35], radii[18]),
					'L',
					radialPointString(iAngles[29], radii[17]),
					'Q',
					radialPointString(iAngles[35], radii[16]),
					radialPointString(iAngles[35], radii[15]),
					'Z'
				].join(' ')}
				fill={`hsl(${hue}, ${saturation}%, 25%)`}
			/>
			<path
				id="innerpetals"
				d={[
					'M',
					radialPointString(iAngles[35], radii[13]),
					'C',
					radialPointString(iAngles[34], radii[14]),
					radialPointString(iAngles[30], radii[13]),
					radialPointString(iAngles[29], radii[14]),
					'A',
					radii[14],
					radii[14],
					'0 0 1',
					radialPointString(iAngles[41], radii[14]),
					'C',
					radialPointString(iAngles[40], radii[13]),
					radialPointString(iAngles[36], radii[14]),
					radialPointString(iAngles[35], radii[13]),
					'Z'
				].join(' ')}
				fill={`hsl(${hue + 30}, ${saturation}%, 25%)`}
			/>
			<path
				id="outerpetals"
				d={[
					'M',
					radialPointString(iAngles[41], radii[11]),
					'C',
					radialPointString(iAngles[41], radii[12]),
					radialPointString(iAngles[35], radii[12]),
					radialPointString(iAngles[35], radii[13]),
					'A',
					radii[13],
					radii[13],
					'0 0 1',
					radialPointString(iAngles[47], radii[13]),
					'C',
					radialPointString(iAngles[46], radii[12]),
					radialPointString(iAngles[41], radii[12]),
					radialPointString(iAngles[41], radii[11]),
					'Z'
				].join(' ')}
				fill={`hsl(${hue + 45}, ${saturation}%, 25%)`}
			/>
		</g>
		<g id="sixth" stroke="black" stroke-width={size / 2 ** 11} fill-opacity={0.25}>
			<path
				id="triangles"
				d={[
					'M',
					radialPointString(iAngles[35], radii[0]),
					'L',
					radialPointString(iAngles[47], radii[13]),
					'A',
					radii[0] / 5,
					radii[0] / 5,
					'0 0 0',
					radialPointString(iAngles[35], radii[16]),
					'A',
					radii[0] / 5,
					radii[0] / 5,
					'0 0 0',
					radialPointString(iAngles[23], radii[13]),
					'Z'
				].join(' ')}
				fill={`hsl(${hue + 30}, ${saturation}%, 25%)`}
			/>

			<path
				id="sixth5"
				d={[
					'M',
					radialPointString(iAngles[47], radii[19]),
					'L',
					radialPointString(iAngles[37], radii[3]),
					'Q',
					radialPointString(iAngles[43], radii[2]),
					radialPointString(iAngles[47], radii[0]),
					'Q',
					radialPointString(iAngles[51], radii[2]),
					radialPointString(iAngles[57], radii[3]),
					'L',
					radialPointString(iAngles[47], radii[19]),
					'Z'
				].join(' ')}
				fill={`hsl(${hue + 45}, ${saturation}%, 25%)`}
			/>
			<path
				id="sixth4"
				d={[
					'M',
					radialPointString(iAngles[47], radii[19]),
					'L',
					radialPointString(iAngles[40], radii[7]),
					'C',
					radialPointString(iAngles[39], radii[2]),
					radialPointString(iAngles[45], radii[3]),
					radialPointString(iAngles[47], radii[0]),
					'C',
					radialPointString(iAngles[49], radii[4]),
					radialPointString(iAngles[55], radii[2]),
					radialPointString(iAngles[54], radii[7]),
					'L',
					radialPointString(iAngles[47], radii[19]),
					'Z'
				].join(' ')}
				fill={`hsl(${hue + 30}, ${saturation}%, 25%)`}
			/>
			<path
				id="sixth3"
				d={[
					'M',
					radialPointString(iAngles[41], radii[11]),
					'C',
					radialPointString(iAngles[41], radii[6]),
					radialPointString(iAngles[47], radii[6]),
					radialPointString(iAngles[47], radii[5]),
					'C',
					radialPointString(iAngles[47], radii[6]),
					radialPointString(iAngles[53], radii[6]),
					radialPointString(iAngles[53], radii[11]),
					'L',
					radialPointString(iAngles[47], radii[19]),
					'L',
					radialPointString(iAngles[41], radii[11]),
					'Z'
				].join(' ')}
				fill={`hsl(${hue + 15}, ${saturation}%, 25%)`}
			/>
			<path
				id="sixth2"
				d={[
					'M',
					radialPointString(iAngles[47], radii[19]),
					'L',
					radialPointString(iAngles[43], radii[12]),
					'C',
					radialPointString(iAngles[44], radii[10]),
					radialPointString(iAngles[47], radii[11]),
					radialPointString(iAngles[47], radii[9]),
					'C',
					radialPointString(iAngles[47], radii[11]),
					radialPointString(iAngles[50], radii[10]),
					radialPointString(iAngles[51], radii[12]),
					'Z'
				].join(' ')}
				fill={`hsl(${hue}, ${saturation}%, 25%)`}
			/>
		</g>
	</defs>
	<Background {size} fill={`hsl(225, 100%, 100%)`} />
	<g stroke-width={size / 2 ** 11} font-size={size / 2 ** 7}>
		<!-- {#each paths as path}
			<path d={path} stroke={`hsl(30, 0%, 50%)`} stroke-width={size / 2 ** 9} />
		{/each} -->
		{#each angles6 as a}
			<use xlink:href="#sixth" transform={`rotate(${a})`} />
		{/each}
		{#each angles as a}
			<use xlink:href="#twelveth" transform={`rotate(${a})`} />
			<use xlink:href="#twelveth" transform={`rotate(${a - 15})`} />
		{/each}

		<!-- <PathBuilder angles={iAngles} {radii} stroke="black" /> -->
	</g>
	<DrLogo
		stroke="black"
		size={size / 20}
		transform={`translate(${size / 2 - size / 18} ${size / 2 - size / 18})`}
	/>
</svg>
