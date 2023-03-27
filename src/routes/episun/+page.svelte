<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import {
		arrayMap,
		circleIntersections,
		phi,
		radialPoint,
		radialPointString,
		viewBox
	} from '$lib/geometry';
	import { useSaveFile } from '$lib/save-svg';
	import { onMount } from 'svelte';

	let size = 2 ** 10;
	let hue = 345;

	let r0 = (size / 2) * 0.9;
	let r1 = r0 / 2;

	const angles = arrayMap(48, (n) => (360 / 48) * n);
	const angles24 = arrayMap(24, (n) => (360 / 24) * n - 105);
	const circles: Circle[] = angles24.map((a, i) => ({ r: r1, ...radialPoint(a + 15, r1) }));
	const radii = [
		r0,
		...arrayMap(11, (n) => n)
			.map((n) => circleIntersections(circles[0], circles[n + 1])[0])
			.map((intersection) => Math.sqrt(intersection.x ** 2 + intersection.y ** 2))
	];

	let svg: SVGSVGElement;
	onMount(() => {
		const unmountSaveFile = useSaveFile(svg);
		return () => {
			unmountSaveFile();
		};
	});
</script>

<svg id="episun" bind:this={svg} viewBox={viewBox(size)}>
	<defs>
		<path
			id="xthing"
			d={[
				'M',
				radialPointString(angles[37], radii[3]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[38], radii[2]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[39], radii[3]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[38], radii[4]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[39], radii[5]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[38], radii[6]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[37], radii[5]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[36], radii[6]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[35], radii[5]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[36], radii[4]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[35], radii[3]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[36], radii[2]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[37], radii[3]),
				'Z'
			].join(' ')}
		/>
		<path
			id="xthing2"
			d={[
				'M',
				radialPointString(angles[41], radii[5]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[42], radii[4]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[43], radii[5]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[42], radii[6]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[43], radii[7]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[42], radii[8]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[41], radii[7]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[40], radii[8]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[39], radii[7]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[40], radii[6]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[39], radii[5]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[40], radii[4]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[41], radii[5]),
				'Z'
			].join(' ')}
		/>
		<path
			id="square1"
			d={[
				'M',
				radialPointString(angles[41], radii[1]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[42], radii[2]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[41], radii[3]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[40], radii[2]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[41], radii[1]),
				'Z'
			].join(' ')}
		/>
		<path
			id="square2"
			d={[
				'M',
				radialPointString(angles[37], radii[7]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[38], radii[8]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[37], radii[9]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[36], radii[8]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[37], radii[7]),
				'Z'
			].join(' ')}
		/>
		<path
			id="diamonds"
			d={[
				'M',
				radialPointString(angles[39], radii[9]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[40], radii[10]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[39], radii[11]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[38], radii[10]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[39], radii[9]),
				'M',
				radialPointString(angles[43], radii[9]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[44], radii[10]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[43], radii[11]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[42], radii[10]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[43], radii[9])
			].join(' ')}
		/>
		<path
			id="bigsquare"
			d={[
				'M',
				radialPointString(angles[36], radii[6]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[38], radii[8]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[36], radii[10]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[34], radii[8]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[36], radii[6]),
				'Z'
			].join(' ')}
		/>
		<path
			id="littlesquare"
			d={[
				'M',
				radialPointString(angles[40], radii[8]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[41], radii[9]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[40], radii[10]),
				'A',
				r1,
				r1,
				'0 0 0',
				radialPointString(angles[39], radii[9]),
				'A',
				r1,
				r1,
				'0 0 1',
				radialPointString(angles[40], radii[8]),
				'Z'
			].join(' ')}
		/>
	</defs>
	<Background {size} fill={`hsl(${hue + 35}, 50%, 25%)`} />
	<g id="figure" stroke-width={size * phi ** 13} fill-opacity="0.75">
		{#each circles as circle, i}
			<circle
				cx={circle.x}
				cy={circle.y}
				r={r1}
				stroke={`hsl(${hue + 15}, 50%, 33%)`}
				fill="none"
			/>
		{/each}

		{#each arrayMap(6, (n) => (360 / 6) * n) as a}
			<use
				href="#bigsquare"
				stroke="black"
				fill={`hsl(${hue + 52}.5, 100%, 50%)`}
				transform={`rotate(${a})`}
			/>
			<use
				href="#littlesquare"
				stroke="black"
				fill={`hsl(${hue + 52}.5, 100%, 50%)`}
				transform={`rotate(${a})`}
			/>
		{/each}

		{#each arrayMap(6, (n) => (360 / 6) * n) as a}
			<use
				href="#xthing"
				stroke="black"
				fill={`hsl(${hue + 30}, 100%, 50%)`}
				transform={`rotate(${a - 7.5})`}
			/>
			<use
				href="#xthing2"
				stroke="black"
				fill={`hsl(${hue + 37}.5, 100%, 50%)`}
				transform={`rotate(${a - 7.5})`}
			/>
			<use
				href="#square1"
				stroke="black"
				fill={`hsl(${hue + 22}.5, 100%, 50%)`}
				transform={`rotate(${a - 7.5})`}
			/>
			<use
				href="#square2"
				stroke="black"
				fill={`hsl(${hue + 45}, 100%, 50%)`}
				transform={`rotate(${a - 7.5})`}
			/>
			<use
				href="#diamonds"
				stroke="black"
				fill={`hsl(${hue + 60}, 100%, 50%)`}
				transform={`rotate(${a - 7.5})`}
			/>
		{/each}
		<circle r={radii[11]} stroke="black" fill={`hsl(${hue + 60}, 100%, 50%)`} fill-opacity="1" />
	</g>
</svg>
