<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import {
		arrayMap,
		radialPoint,
		viewBox,
		circleIntersections,
		radialPointString,
		phylotaxicPoints,
		phi,
		Phi
	} from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { useZoomableViewbox } from '$lib/use-zoomable-viewbox';
	import { onMount } from 'svelte';
	import HexTiles from './HexTiles.svelte';

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountZoomable = useZoomableViewbox(svg);
		const unMountSave = useSaveFile(svg);
		return () => {
			unmountZoomable();
			unMountSave();
		};
	});
	const size = 1080;
	const strokeWidth = size / 1080;
	const r0 = (size / 2) * 0.9;
	const r1 = r0 / 2;
	const angles6 = arrayMap(6, (n) => (360 / 6) * n);
	const angles12 = arrayMap(12, (n) => (360 / 12) * n);
	const angles24 = arrayMap(24, (n) => (360 / 24) * n - 105);
	const angles48 = arrayMap(48, (n) => (360 / 48) * n);
	const circles: Circle[] = angles24.map((a, i) => ({ r: r1, ...radialPoint(a + 15, r1) }));
	const radii = [
		r0,
		...arrayMap(10, (n) => n)
			.map((n) => circleIntersections(circles[0], circles[n + 1])[0])
			.map((intersection) => Math.sqrt(intersection.x ** 2 + intersection.y ** 2))
	];
	// const rm = radii[9] / 5;
	const rm = arrayMap(5, (n) => (radii[9] / 5) * n + 1);
</script>

<svg bind:this={svg} id="z" viewBox={viewBox(size)}>
	<defs>
		<radialGradient id="gradient1" cy="44%">
			<stop offset="0%" stop-color="hsla(300, 100%, 50%, 0.5)" />
			<stop offset="50%" stop-color="hsla(270, 50%, 50%, 0.5)" />
			<stop offset="100%" stop-color="black" />
		</radialGradient>
		<linearGradient id="gradient2" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="hsla(60, 100%, 50%, 0.75)" />
			<stop offset="50%" stop-color="hsla(30, 100%, 50%, 0.75)" />
			<stop offset="100%" stop-color="hsla(0, 100%, 50%, 0.5" />
		</linearGradient>
		<radialGradient id="gradient3" r="66%" cy="60%">
			<stop offset="0%" stop-color="hsla(300, 100%, 50%, 0.5)" />
			<stop offset="50%" stop-color="hsla(270, 100%, 50%, 0.5)" />
			<stop offset="100%" stop-color="hsla(240, 100%, 00%, 0.5" />
		</radialGradient>
		<g id="guide">
			{#each circles as circle, i}
				<circle
					cx={circle.x}
					cy={circle.y}
					r={circle.r}
					stroke="white"
					stroke-width={strokeWidth}
					fill="none"
				/>
			{/each}

			{#each radii as r, i}
				<circle {r} stroke="white" stroke-width={strokeWidth} fill="none" />
				<text x={r} fill="white" text-anchor="middle">{i}</text>
			{/each}
			{#each angles48 as a, i}
				<path d={`M0,0L${radialPointString(a, r0)}`} stroke="white" stroke-width={strokeWidth} />
				<text
					x={radialPoint(a, r0).x}
					y={radialPoint(a, r0).y}
					text-anchor="middle"
					alignment-baseline="middle"
					fill="white">{i}</text
				>
			{/each}
		</g>
		<path
			id="petal"
			d={[
				'M',
				radialPointString(angles24[0], radii[4]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles24[1], radii[2]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles24[2], radii[4]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles24[1], radii[6]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles24[0], radii[4]),
				'Z'
			].join(' ')}
		/>
		<path
			id="path2"
			d={[
				'M',
				radialPointString(angles48[1], radii[6]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles48[2], radii[5]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles48[3], radii[6]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles48[2], radii[7]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles48[1], radii[6]),
				'Z'
			].join(' ')}
		/>
		<path
			id="path4"
			d={[
				'M',
				radialPointString(angles48[36], radii[6]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles48[38], radii[8]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles48[37], radii[9]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles48[35], radii[9]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles48[34], radii[8]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles48[36], radii[6]),
				'Z'
			].join(' ')}
		/>
		<path
			id="path5"
			d={[
				'M',
				radialPointString(angles48[40], radii[6]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles48[41], radii[7]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles48[39], radii[9]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles48[41], radii[9]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles48[39], radii[7]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles48[40], radii[6]),
				'Z'
			].join(' ')}
		/>
		<g id="path4path5">
			{#each angles6 as a}
				<use
					href="#path4"
					stroke="white"
					stroke-width={strokeWidth}
					fill="url(#gradient2)"
					transform={`rotate(${a})`}
				/>
				<use
					href="#path5"
					stroke="white"
					stroke-width={strokeWidth}
					fill="url(#gradient3)"
					transform={`rotate(${a})`}
				/>
			{/each}
			{#each angles12 as a}
				<use
					href="#path2"
					stroke="white"
					stroke-width={strokeWidth}
					fill="hsla(270, 25%, 75%, 0.5)"
					transform={`rotate(${a}) scale(1.02)`}
				/>
				<use
					href="#path2"
					stroke="white"
					stroke-width={strokeWidth}
					fill="hsla(240, 25%, 50%, 0.5)"
					transform={`rotate(${a}) scale(0.98)`}
				/>
			{/each}
		</g>
		<mask id="path4path5mask">
			<Background width={size} fill="black" />
			<use href="#path4path5" filter="white" />
		</mask>
		<g id="phyloDots">
			{#each phylotaxicPoints( 540, radii[2] - radii[6], { center: radialPoint(angles24[1], radii[4]) } ) as p, i}
				<g>
					<circle
						cx={p.x}
						cy={p.y}
						r={size / 768}
						fill={`hsl(270, 0%, ${100 - (i % 8) * 10}%)`}
						mask="url(#petalMask)"
					/>
				</g>
			{/each}
		</g>
		<mask id="petalMask">
			<Background width={size} fill="black" />
			{#each angles12 as a, i}
				<use href="#petal" transform={`rotate(${a})`} fill="white" />
			{/each}
		</mask>
		<g id="metatronSixth" fill="none">
			<!-- <circle cx={rm[2]} r={rm[1]} /> -->
			<!-- <circle cx={rm[4]} r={rm[1]} /> -->
			<path d={`M0 0H${rm[4]}`} />
			<path
				d={[
					'M',
					radialPointString(angles6[0], rm[4]),
					'L',
					radialPointString(angles6[2], rm[2])
				].join(' ')}
			/>
			<path
				d={[
					'M',
					radialPointString(angles6[0], rm[4]),
					'L',
					radialPointString(angles6[4], rm[2])
				].join(' ')}
			/>
			<path
				d={[
					'M',
					radialPointString(angles6[0], rm[4]),
					'L',
					radialPointString(angles6[1], rm[2])
				].join(' ')}
			/>
			<path
				d={[
					'M',
					radialPointString(angles6[0], rm[4]),
					'L',
					radialPointString(angles6[5], rm[2])
				].join(' ')}
			/>
			<path
				d={[
					'M',
					radialPointString(angles6[0], rm[4]),
					'L',
					radialPointString(angles6[1], rm[4])
				].join(' ')}
			/>
			<path
				d={[
					'M',
					radialPointString(angles6[0], rm[2]),
					'L',
					radialPointString(angles6[1], rm[2])
				].join(' ')}
			/>
			<path
				d={[
					'M',
					radialPointString(angles6[0], rm[2]),
					'L',
					radialPointString(angles6[2], rm[2])
				].join(' ')}
			/>
		</g>
		<g id="metatron" transform="rotate(30)">
			{#each angles6 as a}
				<use href="#metatronSixth" transform={`rotate(${a})`} />
			{/each}
		</g>
		<mask id="hextileMask">
			<radialGradient id="hextileGradient">
				<stop offset="0%" stop-color="hsla(270, 100%, 100%, 1)" />
				<stop offset="100%" stop-color="hsla(270, 100%, 66%, 0.5)" />
			</radialGradient>
			<Background width={size} fill="url(#hextileGradient)" />
		</mask>
	</defs>
	<Background width={size} fill="hsl(240, 50%, 0%)" />
	<use href="#guide" mask="url(#path4path5mask)" />

	<!-- <use href="#guide" /> -->
	<g id="hextiles" mask="url(#hextileMask)">
		<HexTiles {size} innerColor="hsl(270, 50%, 50%)" outerColor="hsl(240, 50%, 30%)" />
	</g>
	<g id="outerRing" stroke="white">
		<circle r={radii[0]} fill="none" />
		<circle r={radii[2]} fill="none" />
		{#each arrayMap(144, (k) => (360 / 144) * k) as a, i}
			<circle
				cx={radialPoint(a, radii[2] + (radii[0] - radii[2]) / 2).x}
				cy={radialPoint(a, radii[2] + (radii[0] - radii[2]) / 2).y}
				r={(radii[0] - radii[2]) / 2 - 2 * strokeWidth}
				fill={`hsl(${300 - (i % 12) * 3}, 100%, 25%)`}
			/>
		{/each}
	</g>
	<use
		href="#metatron"
		stroke="hsl(0, 100%, 50%)"
		stroke-width={strokeWidth * 2}
		transform={`scale(${Phi})`}
	/>
	<use href="#metatron" stroke="hsl(60, 100%, 50%)" transform={`scale(${Phi})`} />
	<g mask="">
		{#each angles12 as a, i}
			<use
				href="#petal"
				transform={`rotate(${a})`}
				stroke="white"
				stroke-width={strokeWidth}
				fill="url(#gradient1)"
			/>
			<use href="#phyloDots" transform={`rotate(${a})`} />
		{/each}
		<use href="#path4path5" />
		{#each angles48 as a, i}
			<circle
				cx={radialPoint(a, radii[8]).x}
				cy={radialPoint(a, radii[8]).y}
				r={radii[0] - radii[1]}
				stroke="white"
				stroke-width={strokeWidth}
				fill={`hsla(45, 100%, 50%, 0.5)`}
			/>
		{/each}
	</g>
</svg>
