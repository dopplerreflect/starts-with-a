<script>
	export let size = 2 ** 8;
	export let scale = 0.05;
</script>

<pattern id="CarbonFiberPattern" patternUnits="objectBoundingBox" width={scale} height={scale}>
	<linearGradient id="carbon-fiber-xgradient">
		<stop offset="0%" stop-color="hsl(0, 0%, 0%)" />
		<stop offset="5%" stop-color="hsl(0, 0%, 10%)" />
		<stop offset="10%" stop-color="hsl(0, 0%, 30%)" />
		<stop offset="95%" stop-color="hsl(0, 0%, 10%)" />
		<stop offset="100%" stop-color="hsl(0, 0%, 5%)" />
	</linearGradient>
	<linearGradient id="carbon-fiber-ygradient" gradientTransform="rotate(90)">
		<stop offset="0%" stop-color="hsl(0, 0%, 0%)" />
		<stop offset="5%" stop-color="hsl(0, 0%, 20%)" />
		<stop offset="10%" stop-color="hsl(0, 0%, 30%)" />
		<stop offset="95%" stop-color="hsl(0, 0%, 10%)" />
		<stop offset="100%" stop-color="hsl(0, 0%, 5%)" />
	</linearGradient>

	<filter id="x-grain">
		<feTurbulence
			seed={0}
			baseFrequency="0.0004 1"
			numOctaves={3}
			type="fractalNoise"
			result="turbulence"
		/>
		<feColorMatrix type="saturate" values="0" result="desaturate" />
		<feComposite
			in="SourceGraphic"
			in2="desaturate"
			operator="arithmetic"
			k1="2"
			k2="0.0"
			k3="0.05"
			result="composite"
		/>
		<feBlend in="composite" in2="SourceGraphic" mode="normal" result="blend" />
		<feComposite in="blend" in2="SourceGraphic" operator="in" />
	</filter>
	<filter id="y-grain">
		<feTurbulence
			seed={0}
			baseFrequency="1 0.0004"
			numOctaves={3}
			type="fractalNoise"
			result="turbulence"
		/>
		<feColorMatrix type="saturate" values="0" result="desaturate" />
		<feComposite
			in="SourceGraphic"
			in2="desaturate"
			operator="arithmetic"
			k1="2"
			k2="0.0"
			k3="0.05"
			result="composite"
		/>
		<feBlend in="composite" in2="SourceGraphic" mode="normal" result="blend" />
		<feComposite in="blend" in2="SourceGraphic" operator="in" />
	</filter>

	<g id="carbon-fiber-L">
		<path
			d={`M0 0H${size / 4}V${size / 2}H0Z`}
			fill="url(#carbon-fiber-ygradient)"
			filter="url(#y-grain)"
		/>
		<path
			d={`M0 ${size / 2}H${size / 2}V${size * 0.75}H0Z`}
			fill="url(#carbon-fiber-xgradient)"
			filter="url(#x-grain)"
		/>
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
