<script lang="ts">
	import { phi } from '$lib/geometry';

	export let size: number;
	export let source: string;
	export let color: string = 'white';
	export let fill: string = 'hsl(0, 0%, 0%)';
	export let fillOpacity: number = 1;

	const sourceLines: { leadingSpaces: number; text: string }[] = source.split(/\n/).map((text) => {
		const match = text.match(/(^[ ]+)/);
		let leadingSpaces = (match && match[0].length) || 0;
		return { leadingSpaces, text };
	});

	const maxLineLength = Math.max(...sourceLines.map((l) => l.text.length));

	const fontSize = size / (sourceLines.length - 4);

	const textBlockWidth = maxLineLength * fontSize * phi;
</script>

<g id="sourceCode">
	<path
		d={`M${-textBlockWidth / 2} ${-size / 2}H${textBlockWidth / 2}V${size / 2}H${
			-textBlockWidth / 2
		}Z`}
		{fill}
		fill-opacity={fillOpacity}
	/>
	<text font-family="monospace" x={-size / 2} y={-size / 2} fill={color} font-size={fontSize}>
		{#each sourceLines as line}
			<tspan x={`${-textBlockWidth / 2 + line.leadingSpaces * fontSize * phi}`} dy="1em"
				>{line.text}</tspan
			>
		{/each}
	</text>
</g>
