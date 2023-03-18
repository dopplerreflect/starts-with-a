<svelte:options namespace="svg" />

<script lang="ts">
	import { useSaveFile } from '$lib/save-svg';
	import { radialPoint, phi } from '$lib/geometry';
	import { polygonScale } from 'geometric';
	import { onMount, onDestroy } from 'svelte';
	import { configs, configIndex } from './configs';
	import { configChanger } from '$lib/config-changer';

	let size = 8092;
	let outerRadius = size / 2;
	let config = configs[0];

	let scaledPolygonPaths: Function;
	const unsubscribe = configIndex.subscribe((value) => {
		config = configs[value];
		let points = [...Array(config.count).keys()].map((k) => {
			let angle = k * (360 - 360 * phi);
			let radius = (outerRadius / config.count) * k;
			return radialPoint(angle, radius);
		});
		let polygons = [...Array(config.count).keys()]
			.map(
				(k) =>
					points[k + 21] && [
						k < 13 ? [0, 0] : [points[k].x, points[k].y],
						[points[k + 13].x, points[k + 13].y],
						[points[k + 21].x, points[k + 21].y],
						[points[k + 8].x, points[k + 8].y]
					]
			)
			.filter((e) => e !== undefined);
		let scaledPolygons = (scale: number): geometric.Polygon[] =>
			polygons.map((p) => polygonScale(p, scale));
		scaledPolygonPaths = (scale: number): string[] =>
			scaledPolygons(scale).map(
				(c) =>
					`M${c[0][0]},${c[0][1]}L${c[1][0]},${c[1][1]}L${c[2][0]},${c[2][1]}L${c[3][0]},${c[3][1]}Z`
			);
	});
	onDestroy(unsubscribe);
	let svg: SVGSVGElement;
	onMount(() => {
		let unMountSaveFile = useSaveFile(svg);
		let unMountConfigChanger = configChanger(configIndex, configs);
		return () => {
			unMountSaveFile();
			unMountConfigChanger();
		};
	});
</script>

<svg
	bind:this={svg}
	id="spiral-tile"
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`${-size / (config.zoom * 2)} ${(-size / (config.zoom * 2)) * phi} ${
		size / config.zoom
	} ${(size / config.zoom) * phi}`}
>
	<defs>
		<radialGradient id="rGradient">
			<stop
				offset="0%"
				stop-color={`hsl(${config.gradient.offset1.hue}, ${config.gradient.offset1.sat}%, ${config.gradient.offset1.lit}%)`}
			/>
			<stop
				offset="100%"
				stop-color={`hsl(${config.gradient.offset2.hue}, ${config.gradient.offset2.sat}%, ${config.gradient.offset2.lit}%)`}
			/>
		</radialGradient>
		<filter id="blur">
			<feOffset result="offOut" in="SourceGraphic" dx="0" dy={size / 270} />
			<feColorMatrix
				result="matrixOut"
				in="offOut"
				type="matrix"
				values="0.25 0 0 0 0 0 0.25 0 0 0 0 0 0.25 0 0 0 0 0 1 0"
			/>
			<feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="10" />
			<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
		</filter>
	</defs>
	<path
		d={`M${-size / 2},${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="url(#rGradient)"
	/>
	<g id="level1" filter="url(#blur)">
		{#each scaledPolygonPaths(1) as path, i}
			<path
				d={path}
				fill={`hsla(${config.level1.fill.hue},${config.level1.fill.sat}%,${config.level1.fill.lit}%,${config.level1.fill.alp})`}
				stroke={`hsla(${(i % 8) + config.level1.stroke.hue}, ${config.level1.stroke.sat}%, ${
					config.level1.stroke.lit
				}%, ${config.level1.stroke.alp})`}
				stroke-width={size / 360}
				stroke-linejoin="round"
			/>
		{/each}
	</g>
	<g id="level2" filter="url(#blur)">
		{#each scaledPolygonPaths(phi) as path, i}
			<path
				d={path}
				fill={`hsla(${(i % 55) + config.level2.fill.hue}, ${config.level2.fill.sat}%, ${
					config.level2.fill.lit
				}%, ${config.level2.fill.alp})`}
				stroke={`hsla(${(i % 55) + config.level2.stroke.hue}, ${config.level2.stroke.sat}%, ${
					config.level2.stroke.lit
				}%, 1)`}
				stroke-width={size / 720}
				stroke-linejoin="round"
			/>
		{/each}
	</g>
	<g id="level3" filter="url(#blur)">
		{#each scaledPolygonPaths(phi ** 2) as path, i}
			<path
				d={path}
				fill={`hsla(${(i % 21) + config.level3.fill.hue}, ${config.level3.fill.sat}%, ${
					config.level3.fill.lit
				}%, ${config.level3.fill.alp})`}
				stroke={`hsla(${(i % 21) + config.level3.stroke.hue}, ${config.level3.stroke.sat}%, ${
					config.level3.stroke.lit
				}%, 1)`}
				stroke-width={size / 1080}
				stroke-linejoin="round"
			/>
		{/each}
	</g>
</svg>
