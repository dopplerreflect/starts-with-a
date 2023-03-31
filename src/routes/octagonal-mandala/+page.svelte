<svelte:options namespace="svg" />

<script lang="ts">
	import { arrayMap, phi, phylotaxicPoints, radialPointString, viewBox } from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';
	import CarbonFiberPattern from '$lib/components/CarbonFiberPattern.svelte';
	import DrLogo from '$lib/components/DRLogo.svelte';
	import { onMount } from 'svelte';
	import { useSaveFile } from '$lib/save-svg';

	const size = 2 ** 10;
	const bgsize = Math.sqrt(size ** 2 * 2);

	const strokeWidth = size / 2 ** 9;
	let hue = 45;

	const r0 = (size / 2) * 0.95;
	const angles = arrayMap(16, (n) => (360 / 16) * n - 90);
	const phiArr = arrayMap(9, (n) => phi ** n);
	const oRadii = [r0, ...phiArr.map((phiN) => Number((r0 - r0 * phiN).toFixed(1)))].sort(
		(a, b) => b - a
	);
	const iRadii = oRadii.map((r) => oRadii[6] - (r0 - r) * 2);
	const radii = [...new Set([...oRadii, ...iRadii].filter((n) => n > 0))].sort((a, b) => b - a);

	const tesselatedOctagonPathArr = [
		radii.slice(0, 8),
		radii.slice(3, 10),
		radii.slice(4, 11),
		radii.slice(5, 12)
	];

	const tesselatedOctagonPaths = tesselatedOctagonPathArr.map((radiiSlice, ri) =>
		[
			'M' +
				angles
					.map((a, i) =>
						radialPointString(a, i % 2 === 0 ? radiiSlice[0] : radiiSlice[ri === 0 ? 6 : 4])
					)
					.join('L') +
				'Z' +
				'M' +
				angles
					.map((a, i) =>
						radialPointString(
							a,
							i % 2 === 0
								? radiiSlice[ri === 0 ? 3 : 1]
								: radiiSlice[ri === 3 ? 6 : ri === 0 ? 7 : 5]
						)
					)
					.join('L') +
				'Z'
		].join('')
	);

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

	<circle r={radii[6]} fill="hsl(${hue + 60}, 100%, 50%)" fill-opacity={0.25} />

	{#each [...tesselatedOctagonPaths].reverse() as path, i}
		<path
			d={path}
			stroke="black"
			fill={`hsl(${hue + 15 * i}, 50%, ${90 - 25 * i}%)`}
			fill-rule="evenodd"
			filter="url(#f3)"
		/>
	{/each}

	{#each phylotaxicPoints(2184, radii[12]) as p, i}
		<circle
			r={strokeWidth}
			cx={p.x}
			cy={p.y}
			fill={`hsl(${hue + 30}, ${100 - Math.round((100 / 2184) * i)}%, 50%)`}
		/>
	{/each}

	<circle r={radii[12]} fill={`hsl(${hue + 45}, 50%, 50%)`} fill-opacity={0.25} />

	{#each [...tesselatedOctagonPaths] as path, i}
		<path
			d={path}
			stroke="black"
			fill={`hsl(${hue + 15 * i}, 50%, ${90 - 25 * i}%)`}
			fill-rule="evenodd"
			filter="url(#f3)"
			transform={`scale(${phi})`}
		/>
	{/each}

	<path
		d={epicycloidPath()}
		stroke={`hsl(${hue + 60}, 25%, 75%)`}
		fill={`hsl(${hue + 60}, 25%, 10%)`}
		fill-opacity={0.5}
		stroke-width={strokeWidth}
		transform="rotate(22.5)"
	/>
	<!-- <PathBuilder {angles} {radii} /> -->
	<DrLogo
		size={size / 20}
		stroke={`hsl(${hue + 0}, 0%, 50%)`}
		strokeOpacity={0.5}
		transform={`translate(${size / 2 - size / 20} ${size / 2 - size / 20})`}
	/>
</svg>
