<svelte:options namespace="svg" />

<script lang="ts">
	import { arrayMap, viewBox } from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';

	const size = 2 ** 13;

	const divs = arrayMap(4, (n) => (size / 4) * n);
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<filter id="filter">
			<feDiffuseLighting in="SourceGraphic" result="light" lighting-color="hsl(220, 100%, 85%)">
				<fePointLight x={0} y={0} z={2 ** 10} />
			</feDiffuseLighting>

			<feComposite
				in="SourceGraphic"
				in2="light"
				operator="arithmetic"
				k1="1"
				k2="0.25"
				k3="0"
				k4="0"
			/>
		</filter>

		<linearGradient id="xgradient">
			<stop offset="0%" stop-color="black" />
			<stop offset="25%" stop-color="hsl(0, 0%, 20%)" />
			<stop offset="50%" stop-color="hsl(0, 0%, 30%)" />
			<stop offset="75%" stop-color="hsl(0, 0%, 20%)" />
			<stop offset="100%" stop-color="hsl(0, 0%, 15%)" />
		</linearGradient>
		<linearGradient id="ygradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="black" />
			<stop offset="25%" stop-color="hsl(0, 0%, 20%)" />
			<stop offset="50%" stop-color="hsl(0, 0%, 30%)" />
			<stop offset="75%" stop-color="hsl(0, 0%, 20%)" />
			<stop offset="100%" stop-color="hsl(0, 0%, 15%)" />
		</linearGradient>
		<g id="hv">
			<path id="vertical" d={`M0 0H${size / 4}V${size / 2}H0Z`} fill="url(#ygradient)" />
			<path
				id="horizontal"
				d={`M0 ${size / 2}H${size / 2}V${size * 0.75}H0Z`}
				fill="url(#xgradient)"
			/>
		</g>
		<g id="tile" transform="">
			<use xlink:href="#hv" />
			<use xlink:href="#hv" transform={`translate(${size / 4} ${-size / 4})`} />
			<use xlink:href="#hv" transform={`translate(${size / 2} ${-size / 2})`} />
			<use xlink:href="#hv" transform={`translate(${-size / 4} ${size / 4})`} />
			<use xlink:href="#hv" transform={`translate(${size / 4} ${size * 0.75})`} />
			<use xlink:href="#hv" transform={`translate(${size / 2} ${size / 2})`} />
			<use xlink:href="#hv" transform={`translate(${size * 0.75} ${size / 4})`} />
		</g>
		<pattern id="tilepattern" patternUnits="objectBoundingBox" width="0.05" height="0.05">
			<use xlink:href="#tile" transform="scale(0.05)" />
		</pattern>
	</defs>
	<Background {size} fill="url(#tilepattern)" filter="url(#filter)" />
</svg>
