<script lang="ts">
	import { phi } from '$lib/geometry';
	import { text } from 'svelte/internal';

	export let size: number;
	export let source: string;
	export let color: string = 'white';
	export let fill: string = 'hsl(0, 0%, 0%, 0.5)';

	const sourceLines: { leadingSpaces: number; text: string }[] = source.split(/\n/).map((text) => {
		const match = text.match(/(^[ ]+)/);
		let leadingSpaces = (match && match[0].length) || 0;
		return { leadingSpaces, text };
	});

	const maxLineLength = Math.max(...sourceLines.map((l) => l.text.length));

	const fontSize = size / (sourceLines.length - 4);

	const shadeWidth = maxLineLength * fontSize * phi;
	const shadeX = -size / 2 + (maxLineLength * fontSize * phi) / 2;
</script>

<g id="sourceCode">
	<path
		d={`M${-shadeWidth / 2} ${-size / 2}H${shadeWidth / 2}V${size / 2}H${-shadeWidth / 2}Z`}
		{fill}
	/>
	<text font-family="monospace" x={-size / 2} y={-size / 2} fill={color} font-size={fontSize}>
		{#each sourceLines as line}
			<tspan x={`${-shadeWidth / 2 + line.leadingSpaces * fontSize * phi}`} dy="1em"
				>{line.text}</tspan
			>
		{/each}
	</text>
</g>
