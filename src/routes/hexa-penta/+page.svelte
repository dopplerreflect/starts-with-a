<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import { phi, radialPoint, radialPointString, viewBox } from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';

	const width = 1024;
	const r = width * phi ** 3;
	const c0 = { x: -r / 2, y: 0 };
	const c1 = { x: r / 2, y: 0 };
	const c2 = { x: 0, y: radialPoint(120, r, { center: c0 }).y };
	const c3 = { x: radialPoint(252, r, { center: c0 }).x, y: radialPoint(252, r, { center: c0 }).y };
	const c4 = { x: radialPoint(288, r, { center: c1 }).x, y: radialPoint(288, r, { center: c1 }).y };
	const qlLine: [Point, Point] = [
		{ x: radialPoint(180, r, { center: c2 }).x, y: radialPoint(180, r, { center: c2 }).y },
		{ x: c4.x, y: c4.y }
	];
	const qrLine: [Point, Point] = [
		{ x: radialPoint(0, r, { center: c2 }).x, y: radialPoint(0, r, { center: c2 }).y },
		{ x: c3.x, y: c3.y }
	];
	let svg: SVGSVGElement;
	onMount(() => {
		const unMountSaveFile = useSaveFile(svg);
		const unMountZoomable = useZoomableViewbox(svg);
		return () => {
			unMountSaveFile();
			unMountZoomable();
		};
	});
</script>

<svg bind:this={svg} id="hexa-penta" viewBox={viewBox(width)}>
	<defs>
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
	<g id="drawing" mask="url(#mask)" display="">
		<circle stroke="white" stroke-width={2} fill="none" cx={c1.x} {r} />
		<circle stroke="white" stroke-width={2} fill="none" cx={c0.x} {r} />
		<circle stroke="white" stroke-width={2} fill="none" cy={c2.y} {r} />
		<circle stroke="white" stroke-width={2} fill="none" cx={c3.x} cy={c3.y} {r} />
		<circle stroke="white" stroke-width={2} fill="none" cx={c4.x} cy={c4.y} {r} />
		<line
			stroke="white"
			stroke-width={2}
			x1={qlLine[0].x}
			y1={qlLine[0].y}
			x2={qlLine[1].x}
			y2={qlLine[1].y}
		/>
		<line
			stroke="white"
			stroke-width={2}
			x1={qrLine[0].x}
			y1={qrLine[0].y}
			x2={qrLine[1].x}
			y2={qrLine[1].y}
		/>
		<use href="#penta-hexa" fill="hsla(240, 100%, 50%, 0.25)" stroke="white" />
	</g>
</svg>
