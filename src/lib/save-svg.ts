async function saveSvg(svg: SVGSVGElement) {
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

async function savePng(svg: SVGSVGElement) {
	console.log('saving png');
	const svgText = new XMLSerializer().serializeToString(svg);
	const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
	const url = window.URL.createObjectURL(svgBlob);
	const canvas = document.createElement('canvas');
	canvas.width = svg.viewBox.baseVal.width;
	canvas.height = svg.viewBox.baseVal.height;
	const ctx = canvas.getContext('2d');
	const img = new Image();
	img.onload = async function () {
		ctx?.drawImage(img, 0, 0);
		window.URL.revokeObjectURL(url);
		const image: Blob = await new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (blob) {
					resolve(blob);
				} else {
					reject('failed to turn canvas to blob');
				}
			});
		});
		try {
			const fileHandle = await window.showSaveFilePicker({
				suggestedName: `${svg.id}.png`,
				types: [{ description: 'PNG File', accept: { 'image/png': ['.png'] } }]
			});
			const writable = await fileHandle.createWritable();
			await writable.write(image);
			await writable.close();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	};
	img.src = url;
}

export function useSaveFile(svg: SVGSVGElement) {
	document.addEventListener('keydown', handleKeypress);
	async function handleKeypress(event: KeyboardEvent) {
		if (event.ctrlKey && event.altKey) {
			if (event.key === 's') {
				await saveSvg(svg);
			}
			if (event.key === 'p') {
				await savePng(svg);
			}
		}
	}
	return () => {
		document.removeEventListener('keydown', handleKeypress);
	};
}
