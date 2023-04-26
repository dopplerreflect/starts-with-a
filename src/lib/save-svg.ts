const debounce = (func: Function, wait: number): Function => {
	let timeout: NodeJS.Timeout;
	return function executedFunction(...args: any) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

const showSize = debounce(async (svg: SVGSVGElement) => {
	const svgText = new XMLSerializer().serializeToString(svg);
	console.log(svgText);
	console.log(`SVG is ${svgText.length} bytes`);
}, 500);

type SaveOptions = {
	timestamp?: boolean;
};

const saveSvg = debounce(async (svg: SVGSVGElement, options: SaveOptions) => {
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
		console.log('Nevermind...', e);
		return false;
	}
}, 500);

const savePng = debounce(async (svg: SVGSVGElement, options: SaveOptions) => {
	console.log('saving png');
	const startTime = Date.now();
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
		const endTime = Date.now();
		console.log('Total time: ', (endTime - startTime) / 1000);
		try {
			let suggestedName = svg.id;
			if (options.timestamp) suggestedName += `-${new Date().toISOString()}`;
			suggestedName += '.png';
			const fileHandle = await window.showSaveFilePicker({
				suggestedName,
				types: [{ description: 'PNG File', accept: { 'image/png': ['.png'] } }]
			});
			const writable = await fileHandle.createWritable();
			await writable.write(image);
			await writable.close();
			return true;
		} catch (e) {
			console.log('Nevermind...', e);
			return false;
		}
	};
	img.src = url;
}, 500);

export function useSaveFile(svg: SVGSVGElement, options: SaveOptions = {}) {
	document.addEventListener('keydown', handleKeypress);
	async function handleKeypress(event: KeyboardEvent) {
		// if (event.key === 'S') {
		// 	await showSize(svg);
		// }
		if (event.key === 'S') {
			await showSize(svg);
			await saveSvg(svg, options);
		}
		if (event.key === 'P') {
			await savePng(svg, options);
		}
	}
	return () => {
		document.removeEventListener('keydown', handleKeypress);
	};
}
