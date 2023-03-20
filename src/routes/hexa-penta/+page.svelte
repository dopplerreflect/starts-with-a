<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import { circleIntersections, phi, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { onMount } from 'svelte';

	const width = 1024;
	const r = width * phi ** 3;
	const c0 = { x: -r / 2, y: 0 };
	const c1 = { x: r / 2, y: 0 };
	const c2 = { x: 0, y: radialPoint(120, r, { center: c0 }).y };
	const c3 = { x: radialPoint(252, r, { center: c0 }).x, y: radialPoint(252, r, { center: c0 }).y };
	const c4 = { x: radialPoint(288, r, { center: c1 }).x, y: radialPoint(288, r, { center: c1 }).y };
	const i1 = circleIntersections({ r, ...c0 }, { r, ...c1 });
	const i2 = circleIntersections({ r, ...c0 }, { r, ...c1 });
	const i3 = circleIntersections({ r, ...c0 }, { r, ...c2 });
	const i4 = circleIntersections({ r, ...c0 }, { r, ...c3 });
	const i5 = circleIntersections({ r, ...c0 }, { r, ...c4 });
	const i6 = circleIntersections({ r, ...c1 }, { r, ...c2 });
	const i7 = circleIntersections({ r, ...c1 }, { r, ...c3 });
	const i8 = circleIntersections({ r, ...c1 }, { r, ...c4 });
	const i9 = circleIntersections({ r, ...c3 }, { r, ...c4 });

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
					radialPointString(324, r, { center: c3 }),
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
	</defs>
	<Background {width} fill="hsl(240, 100%, 20%)" />
	<g id="drawing" mask="url(#mask)">
		<circle cx={c1.x} {r} />
		<circle cx={c0.x} {r} />
		<circle cy={c2.y} {r} />
		<circle cx={c3.x} cy={c3.y} {r} />
		<circle cx={c4.x} cy={c4.y} {r} />
		<line
			class="horizontal axis"
			x1={radialPoint(180, r, { center: c0 }).x}
			x2={radialPoint(0, r, { center: c1 }).x}
		/>
		<line class="vertical axis" y1={c2.y} y2={radialPoint(240, r, { center: c1 }).y} />
		<line
			class="quarter left"
			x1={radialPoint(180, r, { center: c2 }).x}
			y1={radialPoint(180, r, { center: c2 }).y}
			x2={c4.x}
			y2={c4.y}
		/>
		<line
			class="quarter right"
			x1={radialPoint(0, r, { center: c2 }).x}
			y1={radialPoint(0, r, { center: c2 }).y}
			x2={c3.x}
			y2={c3.y}
		/>
		<use href="#penta-hexa" fill="hsla(240, 100%, 50%, 0.25)" stroke="white" />
	</g>
	{#each [i1, i2, i3, i4, i5, i6, i7, i8, i9] as iN}
		{#each iN as i, h}
			<circle cx={i.x} cy={i.y} r={r * phi ** 5} stroke={`hsl(${(360 / 5) * h}, 100%, 50%)`} />
		{/each}
	{/each}
</svg>
