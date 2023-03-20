<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import { phi, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { onMount } from 'svelte';

	const width = 1024;
	const r = width * phi ** 3;
	const c0 = { x: -r / 2, y: 0 };
	const c1 = { x: r / 2, y: 0 };
	const c2 = { x: 0, y: radialPoint(120, r, { center: c0 }).y };
	let svg: SVGSVGElement;
	onMount(() => {
		const unMountSaveFile = useSaveFile(svg);
		return () => {
			unMountSaveFile();
		};
	});
</script>

<svg bind:this={svg} id="hexa-penta" viewBox={viewBox(width)}>
	<defs>
		<style>
			circle,
			path,
			line {
				stroke-width: 2;
				stroke: hsl(249, 100%, 100%);
			}
			circle {
				fill: none;
			}
		</style>
		<g id="penta-hexa">
			<path
				class="penta"
				d={[
					'M',
					-r / 2,
					0,
					'L',
					radialPointString(252, r, { center: c0 }),
					'L',
					radialPointString(324, r, {
						center: {
							x: radialPoint(252, r, { center: c0 }).x,
							y: radialPoint(252, r, { center: c0 }).y
						}
					}),
					'L',
					radialPointString(288, r, { center: c1 }),
					'L',
					r / 2,
					0
				].join(' ')}
			/>
			<path
				class="hexa"
				d={[
					'M',
					-r / 2,
					0,
					radialPointString(180, r, { center: c2 }),
					'L',
					radialPointString(120, r, { center: c2 }),
					'L',
					radialPointString(60, r, { center: c2 }),
					'L',
					radialPointString(0, r, { center: c2 }),
					'L',
					radialPointString(300, r, { center: c2 })
				].join(' ')}
			/>
		</g>
		<mask id="mask">
			<Background {width} fill="hsla(0, 0%, 20%, 0.5)" />
			<use href="#penta-hexa" fill="white" stroke="white" />
		</mask>
		<g id="drawing" mask="url(#mask)">
			<circle cx={c1.x} {r} />
			<circle cx={c0.x} {r} />
			<circle cy={c2.y} {r} />
			<circle
				cx={radialPoint(252, r, { center: c0 }).x}
				cy={radialPoint(252, r, { center: c0 }).y}
				{r}
			/>
			<circle
				cx={radialPoint(288, r, { center: c1 }).x}
				cy={radialPoint(288, r, { center: c1 }).y}
				{r}
			/>
			<line
				class="horizontal axis"
				x1={radialPoint(180, r, { center: c0 }).x}
				x2={radialPoint(0, r, { center: c1 }).x}
			/>
			<line class="vertical axis" y1={c2.y} y2={radialPoint(240, r, { center: c1 }).y} />
			<line
				class="quarter left"
				x1={radialPoint(180, r, { center: { x: 0, y: c2.y } }).x}
				y1={radialPoint(180, r, { center: { x: 0, y: c2.y } }).y}
				x2={radialPoint(288, r, { center: c1 }).x}
				y2={radialPoint(288, r, { center: c1 }).y}
			/>
			<line
				class="quarter right"
				x1={radialPoint(0, r, { center: { x: 0, y: c2.y } }).x}
				y1={radialPoint(0, r, { center: { x: 0, y: c2.y } }).y}
				x2={radialPoint(252, r, { center: c0 }).x}
				y2={radialPoint(252, r, { center: c0 }).y}
			/>
		</g>
	</defs>
	<Background {width} fill="hsl(240, 100%, 20%)" />
	<g id="drawing" mask="url(#mask)">
		<circle cx={c1.x} {r} />
		<circle cx={c0.x} {r} />
		<circle cy={c2.y} {r} />
		<circle
			cx={radialPoint(252, r, { center: c0 }).x}
			cy={radialPoint(252, r, { center: c0 }).y}
			{r}
		/>
		<circle
			cx={radialPoint(288, r, { center: c1 }).x}
			cy={radialPoint(288, r, { center: c1 }).y}
			{r}
		/>
		<line
			class="horizontal axis"
			x1={radialPoint(180, r, { center: c0 }).x}
			x2={radialPoint(0, r, { center: c1 }).x}
		/>
		<line class="vertical axis" y1={c2.y} y2={radialPoint(240, r, { center: c1 }).y} />
		<line
			class="quarter left"
			x1={radialPoint(180, r, { center: { x: 0, y: c2.y } }).x}
			y1={radialPoint(180, r, { center: { x: 0, y: c2.y } }).y}
			x2={radialPoint(288, r, { center: c1 }).x}
			y2={radialPoint(288, r, { center: c1 }).y}
		/>
		<line
			class="quarter right"
			x1={radialPoint(0, r, { center: { x: 0, y: c2.y } }).x}
			y1={radialPoint(0, r, { center: { x: 0, y: c2.y } }).y}
			x2={radialPoint(252, r, { center: c0 }).x}
			y2={radialPoint(252, r, { center: c0 }).y}
		/>
		<use href="#penta-hexa" fill="hsla(240, 100%, 50%, 0.25)" stroke="white" />
	</g>
</svg>
