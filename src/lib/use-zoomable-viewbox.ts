export function useZoomableViewbox(
	svg: SVGSVGElement,
	zoom: number = 0,
	xPan: number = 0,
	yPan: number = 0
) {
	// console.log('using zoomable viewbox');
	const { x, y, width, height } = svg.viewBox.baseVal;
	// let zoom = 0;
	// let xPan = 0;
	// let yPan = 0;
	function setViewbox() {
		svg.viewBox.baseVal.x = (x / 10) * (10 - zoom) + (x / 10) * xPan;
		svg.viewBox.baseVal.y = (y / 10) * (10 - zoom) + (x / 10) * yPan;
		svg.viewBox.baseVal.width = (width / 10) * (10 - zoom);
		svg.viewBox.baseVal.height = (height / 10) * (10 - zoom);
	}
	function zoomIn() {
		if (zoom < 9) zoom += 1;
		setViewbox();
	}
	function zoomOut() {
		if (zoom > 0) zoom -= 1;
		setViewbox();
	}
	function panLeft() {
		xPan += 1;
		setViewbox();
	}
	function panRight() {
		xPan -= 1;
		setViewbox();
	}
	function panUp() {
		yPan += 1;
		setViewbox();
	}
	function panDown() {
		yPan -= 1;
		setViewbox();
	}
	const handleKeydown = (e: KeyboardEvent) => {
		if (e.ctrlKey) return;
		switch (e.key) {
			case '=':
				zoomIn();
				break;
			case '-':
				zoomOut();
				break;
			case 'ArrowLeft':
				panLeft();
				break;
			case 'ArrowRight':
				panRight();
				break;
			case 'ArrowUp':
				panUp();
				break;
			case 'ArrowDown':
				panDown();
				break;
			case '0':
				zoom = 0;
				xPan = 0;
				yPan = 0;
				setViewbox();
				break;
			default:
				break;
		}
	};

	document.addEventListener('keydown', handleKeydown);
	setViewbox();
	return () => {
		document.removeEventListener('keydown', handleKeydown);
		// console.log('unmounting useZoomableViewbox');
	};
}
