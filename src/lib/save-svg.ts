async function saveSvg(svg: SVGElement) {
	console.log('saving svg');
	const svgText = new XMLSerializer().serializeToString(svg);
	try {
		const fileHandle = await window.showSaveFilePicker({
			suggestedName: `${svg.id}.svg`,
			types: [{ description: 'SVG File', accept: { 'image/svg+xml': ['.svg'] } }]
		});
		const writable = await fileHandle.createWritable();
		await writable.write(svgText);
		await writable.close();
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export function useSaveFile(svg: SVGElement) {
	document.addEventListener('keydown', handleKeypress);
	async function handleKeypress(event: KeyboardEvent) {
		if (event.ctrlKey && event.altKey) {
			console.log(event);
			if (event.key === 's') {
				await saveSvg(svg);
			}
		}
	}
	return () => {
		document.removeEventListener('keydown', handleKeypress);
	};
}
