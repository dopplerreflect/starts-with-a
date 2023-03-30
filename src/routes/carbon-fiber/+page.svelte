<svelte:options namespace="svg" />

<script lang="ts">
	import { arrayMap, viewBox } from '$lib/geometry';
	import Background from '$lib/components/Background.svelte';

	const size = 2 ** 13;

	const divs = arrayMap(4, (n) => (size / 4) * n);
</script>

<svg viewBox={viewBox(size)}>
	<defs>
		<filter id="yturbulence">
			<feTurbulence type="turbulence" baseFrequency="0.25 0.0001" />
			<feComposite in="SourceGraphic" in2="turbulence" operator="xor" />
		</filter>
		<filter id="xturbulence">
			<feTurbulence type="turbulence" baseFrequency="0.0001 0.25" />
			<feComposite in="SourceGraphic" in2="turbulence" operator="xor" />
		</filter>
		<g id="hv" stroke="hsl(240, 50%, 0%)" stroke-width="5">
			<path
				id="vertical"
				d={`M0 0H${size / 4}V${size / 2}H0Z`}
				filter="url(#yturbulence)"
				fill="hsl(0, 0%, 5%)"
			/>
			<path
				id="horizontal"
				d={`M0 ${size / 2}H${size / 2}V${size * 0.75}H0Z`}
				filter="url(#xturbulence)"
				fill="hsl(0, 0%, 0%)"
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
		<pattern id="tilepattern" patternUnits="objectBoundingBox" width="0.03" height="0.03">
			<use xlink:href="#tile" transform="scale(0.03)" />
		</pattern>
	</defs>
	<Background {size} fill={`hsl(220, 10%, 90%)`} />
	<Background {size} fill="url(#tilepattern)" />
</svg>
