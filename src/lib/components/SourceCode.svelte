<script lang="ts">
	import { phi } from '$lib/geometry';

	export let size: number;
	export let source: string;

	const sourceLines: { leadingSpaces: number; text: string }[] = source.split(/\n/).map((text) => {
		const match = text.match(/(^[ ]+)/);
		let leadingSpaces = (match && match[0].length) || 0;
		return { leadingSpaces, text };
	});

	const maxLineLength = Math.max(...sourceLines.map((l) => l.text.length));

	const fontSize = size / (sourceLines.length - 4);
</script>

<g id="sourceCode">
	<text font-family="monospace" x={-size / 2} y={-size / 2} fill="white" font-size={fontSize}>
		{#each sourceLines as line}
			<tspan
				x={`${
					-size / 2 + (line.leadingSpaces * fontSize * phi + maxLineLength * fontSize * phi) / 2
				}`}
				dy="1em">{line.text}</tspan
			>
		{/each}
	</text>
</g>
