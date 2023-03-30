<script>
	export let size = 2 ** 8;
	export let scale = 0.05;
</script>

<pattern id="CarbonFiberPattern" patternUnits="objectBoundingBox" width={scale} height={scale}>
	<linearGradient id="carbon-fiber-xgradient">
		<stop offset="0%" stop-color="black" />
		<stop offset="25%" stop-color="hsl(0, 0%, 20%)" />
		<stop offset="50%" stop-color="hsl(0, 0%, 30%)" />
		<stop offset="75%" stop-color="hsl(0, 0%, 20%)" />
		<stop offset="100%" stop-color="hsl(0, 0%, 15%)" />
	</linearGradient>
	<linearGradient id="carbon-fiber-ygradient" gradientTransform="rotate(90)">
		<stop offset="0%" stop-color="black" />
		<stop offset="25%" stop-color="hsl(0, 0%, 20%)" />
		<stop offset="50%" stop-color="hsl(0, 0%, 30%)" />
		<stop offset="75%" stop-color="hsl(0, 0%, 20%)" />
		<stop offset="100%" stop-color="hsl(0, 0%, 15%)" />
	</linearGradient>
	<g id="carbon-fiber-L">
		<path d={`M0 0H${size / 4}V${size / 2}H0Z`} fill="url(#carbon-fiber-ygradient)" />
		<path d={`M0 ${size / 2}H${size / 2}V${size * 0.75}H0Z`} fill="url(#carbon-fiber-xgradient)" />
	</g>
	<g id="carbon-fiber-tile" transform="">
		<use xlink:href="#carbon-fiber-L" />
		<use xlink:href="#carbon-fiber-L" transform={`translate(${size / 4} ${-size / 4})`} />
		<use xlink:href="#carbon-fiber-L" transform={`translate(${size / 2} ${-size / 2})`} />
		<use xlink:href="#carbon-fiber-L" transform={`translate(${-size / 4} ${size / 4})`} />
		<use xlink:href="#carbon-fiber-L" transform={`translate(${size / 4} ${size * 0.75})`} />
		<use xlink:href="#carbon-fiber-L" transform={`translate(${size / 2} ${size / 2})`} />
		<use xlink:href="#carbon-fiber-L" transform={`translate(${size * 0.75} ${size / 4})`} />
	</g>
	<use xlink:href="#carbon-fiber-tile" transform={`scale(${scale})`} />
</pattern>
