<svelte:options namespace="svg" />

<script lang="ts">
	import { arrayMap, phi, radialPointString, viewBox } from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';
	import CarbonFiberPattern from '$lib/components/CarbonFiberPattern.svelte';
	import DrLogo from '$lib/components/DRLogo.svelte';
	import { onMount } from 'svelte';
	import { useSaveFile } from '$lib/save-svg';

	const size = 2 ** 10;
	const bgsize = Math.sqrt(size ** 2 * 2);
	const strokeWidth = size / 2 ** 9;

	const r0 = (size / 2) * 0.95;
	const angles = arrayMap(16, (n) => (360 / 16) * n - 90);
	const oRadii = [
		r0,
		...arrayMap(9, (n) => Number((r0 - r0 * phi ** n).toFixed(1))).sort((a, b) => b - a)
	];
	const iRadii = oRadii.map((r) => oRadii[6] - (r0 - r) * 2);
	const radii = [...new Set([...oRadii, ...iRadii].sort((a, b) => b - a).filter((n) => n > 0))];

	const tesselatedOctagonPath4 =
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[0] : radii[6])).join('L') +
		'Z' +
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[3] : radii[7])).join('L') +
		'Z';

	const tesselatedOctagonPath3 =
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[3] : radii[7])).join('L') +
		'Z' +
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[4] : radii[8])).join('L') +
		'Z';

	const tesselatedOctagonPath2 =
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[4] : radii[8])).join('L') +
		'Z' +
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[5] : radii[9])).join('L') +
		'Z';

	const tesselatedOctagonPath =
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[5] : radii[9])).join('L') +
		'Z' +
		'M' +
		angles.map((a, i) => radialPointString(a, i % 2 === 0 ? radii[6] : radii[11])).join('L') +
		'Z';

	/** break */

	const R = radii[13] / Math.PI;
	const k = 8 / 13;

	const epangles: number[] = [];
	for (let x = 0; x <= Math.PI * 32; x += 0.1) {
		epangles.push(x);
	}
	const epicycloid = (angle: number): { x: number; y: number } => ({
		x: R * (k + 1) * Math.cos(angle) - R * Math.cos((k + 1) * angle),
		y: R * (k + 1) * Math.sin(angle) - R * Math.sin((k + 1) * angle)
	});
	const epicycloidPath = () => {
		const [o, ...rest] = epangles;
		return `M${epicycloid(o).x},${epicycloid(o).y} ${rest
			.map((r) => `L${epicycloid(r).x},${epicycloid(r).y}`)
			.join(' ')}`;
	};
	let svg: SVGSVGElement;
	onMount(() => {
		const unmountSaveFile = useSaveFile(svg);
		return () => {
			unmountSaveFile();
		};
	});
</script>

<svg id="octagonal-framed-epicycloid-on-carbon-fiber" bind:this={svg} viewBox={viewBox(size)}>
	<defs>
		<CarbonFiberPattern size={bgsize} scale={0.05} />
		<filter id="f3" x="0" y="0" width="150%" height="150%">
			<feOffset result="offOut" in="SourceAlpha" dx={strokeWidth} dy={strokeWidth * 2} />
			<feGaussianBlur result="blurOut" in="offOut" stdDeviation={strokeWidth * 3} />
			<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
		</filter>
	</defs>
	<Background size={bgsize} transform={'rotate(45)'} fill="url(#CarbonFiberPattern)" />

	<circle r={radii[6]} fill="hsl(225, 50%, 75%)" fill-opacity={0.25} />
	<path
		d={tesselatedOctagonPath}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(0, 50%, 90%)`}
		fill-rule="evenodd"
	/>
	<path
		d={tesselatedOctagonPath2}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(22.5, 50%, 60%)`}
		fill-rule="evenodd"
		filter="url(#f3)"
	/>
	<path
		d={tesselatedOctagonPath3}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(45, 50%,30%)`}
		fill-rule="evenodd"
		filter="url(#f3)"
	/>
	<path
		d={tesselatedOctagonPath4}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(60, 50%, 15%)`}
		fill-rule="evenodd"
		filter="url(#f3)"
	/>

	<circle r={radii[12]} fill="hsl(225, 100%, 50%)" fill-opacity={0.25} />

	<path
		d={tesselatedOctagonPath4}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(0, 50%, 90%)`}
		fill-rule="evenodd"
		filter="url(#f3)"
		transform={`scale(${phi})`}
	/>
	<path
		d={tesselatedOctagonPath3}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(22.5, 50%, 60%)`}
		fill-rule="evenodd"
		filter="url(#f3)"
		transform={`scale(${phi})`}
	/>
	<path
		d={tesselatedOctagonPath2}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(45, 50%,30%)`}
		fill-rule="evenodd"
		filter="url(#f3)"
		transform={`scale(${phi})`}
	/>
	<path
		d={tesselatedOctagonPath}
		stroke-width={strokeWidth}
		stroke="black"
		fill={`hsl(60, 50%, 15%)`}
		fill-rule="evenodd"
		filter="url(#f3)"
		transform={`scale(${phi})`}
	/>

	<path
		d={epicycloidPath()}
		stroke="hsl(60, 25%, 75%)"
		fill="hsl(30, 25%, 10%)"
		fill-opacity={0.25}
		stroke-width={strokeWidth}
		filter="url(#f3)"
		transform="rotate(22.5)"
	/>
	<!-- <PathBuilder {angles} {radii} /> -->
	<DrLogo
		size={size / 20}
		stroke={`hsl(0, 0%, 50%)`}
		strokeOpacity={0.5}
		transform={`translate(${size / 2 - size / 20} ${size / 2 - size / 20})`}
	/>
</svg>
