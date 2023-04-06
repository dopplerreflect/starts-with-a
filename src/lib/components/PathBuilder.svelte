<script lang="ts">
	import { browser } from '$app/environment';
	import { radialPoint, polygonPath, radialPointString } from '$lib/geometry';
	import { onMount } from 'svelte';

	export let size = 2 ** 10;
	export let angles: number[] = [];
	export let radii: number[] = [];
	export let stroke = 'hsl(220, 100%, 75%)';
	export let verbose = false;

	let currentAngle = 0;
	let currentRadius = 0;
	$: currentPoint = radialPoint(angles[currentAngle], radii[currentRadius]);
	let pathCode: string[] = [];
	let path = '';
	let pathDSL = '';

	const pathStrings = ['a', 'c', 'h', 'l', 'm', 's', 't', 'q', 'v', 'z'];

	function handleKeydown(event: KeyboardEvent) {
		event.preventDefault();
		if (!event.ctrlKey) return;
		// console.log(event);
		const { key } = event;
		key === 'r' && window.location.reload();
		if (pathStrings.includes(key)) {
			pathCode.push(`"${key.toUpperCase()}"`);
			pathDSL += key.toUpperCase();
		}
		switch (key) {
			case 'Enter':
				pathCode.push(`radialPointString(angles[${currentAngle}], radii[${currentRadius}])`);
				pathDSL += `${currentAngle} ${currentRadius} `;
				break;
			case 'a':
				pathCode.push(`radii[${currentRadius}]`);
				pathCode.push(`radii[${currentRadius}]`);
				pathCode.push('"0 0 0"');
				pathDSL += `${currentRadius} ${currentRadius} 0 0 0 `;
				break;
			case 'Backspace':
				pathCode.pop();
				break;
			case 'z':
			case 'p':
				buildPath();
				break;
			case 'ArrowRight':
				currentAngle = currentAngle === angles.length - 1 ? 0 : currentAngle + 1;
				break;
			case 'ArrowLeft':
				currentAngle = currentAngle === 0 ? angles.length - 1 : currentAngle - 1;
				break;
			case 'ArrowDown':
				currentRadius = currentRadius === radii.length - 1 ? 0 : currentRadius + 1;
				break;
			case 'ArrowUp':
				currentRadius = currentRadius === 0 ? radii.length - 1 : currentRadius - 1;
				break;
		}
		if (verbose) {
			console.log(pathCode.join(','));
		} else {
			console.log(pathDSL);
		}
	}

	function copyTextToClipboard(text: string) {
		if (browser) {
			console.log(text);
			navigator.clipboard.writeText(text);
		}
	}

	let p: SVGPathElement;
	function buildPath() {
		if (pathCode[0].toUpperCase() !== '"M"') return;
		path = eval(`[${pathCode.join(',')}].join(' ')`);
		p.setAttribute('d', path);
		if (verbose) {
			copyTextToClipboard(path);
		} else {
			copyTextToClipboard(pathDSL.replace(/(\d) ([A-Z])/g, '$1$2'));
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<g id="PathBuilder">
	<path
		d={`M${-size / 2} ${-size / 2}H${size / 2}V${size / 2}H${-size / 2}Z`}
		fill="hsla(0, 50%, 50%, 0.0)"
	/>
	{#each radii as r, i}
		<circle {r} {stroke} fill="none" />
	{/each}
	{#each angles as a, i}
		<path
			d={`M${radialPointString(a, radii[0])}L${radialPointString(a, radii[radii.length - 1])}`}
			{stroke}
		/>
	{/each}
	<g id="marker" stroke-width={size / 200}>
		<path
			d={polygonPath(4, size / 100, {
				center: { x: currentPoint.x, y: currentPoint.y },
				rotate: currentAngle
			})}
			stroke="stroke"
			fill="red"
		/>

		<path d={`M${currentPoint.x} ${-size / 2}V${size}`} stroke="red" />
		<path d={`M${-size / 2} ${currentPoint.y}H${size}`} stroke="red" />
	</g>
	<path bind:this={p} stroke="yellow" fill="none" />
</g>
