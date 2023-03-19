export const Phi = (Math.sqrt(5) + 1) / 2;
export const phi = Phi - 1;
export const SQRT3 = Math.sqrt(3);

/**
 * Returns angles for a circle divided by count. Rotates -90deg.
 * @param count
 */
export function anglesArray(count: number) {
	return [...Array(count).keys()].map((i) => (360 / count) * i - 90);
}

/**
 * Calculate a Point for a given angle and radius
 * @param angle
 * @param radius
 * @param options GeometryOptions
 * @returns
 */
export function radialPoint(angle: number, radius: number, options?: GeometryOptions): Point {
	let center = options?.center || { x: 0, y: 0 };
	let rotate = options?.rotate || 0;
	return {
		x: Number((center.x + radius * Math.cos((angle + rotate) * (Math.PI / 180))).toFixed(2)),
		y: Number((center.y + radius * Math.sin((angle + rotate) * (Math.PI / 180))).toFixed(2))
	};
}

/**
 * radialPoint as a string
 * @param angle
 * @param radius
 * @param options
 * @returns
 */
export function radialPointString(
	angle: number,
	radius: number,
	options?: GeometryOptions
): string {
	let point = radialPoint(angle, radius, options);
	return `${point.x},${point.y}`;
}

/**
 * Returns an array of Points to draw a regular polygon
 * @param count
 * @param radius
 * @param center
 */
export function polygon(count: number, radius: number, options?: GeometryOptions): Point[] {
	return anglesArray(count).map((angle) => radialPoint(angle, radius, options));
}

/**
 * Obtain a path for a polygon
 * @param count
 * @param radius
 * @param center
 * @returns svg path string
 */
export function polygonPath(count: number, radius: number, options?: GeometryOptions): string {
	return (
		polygon(count, radius, options)
			.map((point, i) => {
				return `${i === 0 ? 'M' : 'L'}${point.x},${point.y}`;
			})
			.join('') + 'Z'
	);
}

/**
 * Draw a 5-pointed star
 * @param radius
 * @param options
 * @returns string svg path
 */
export function starPath(radius: number, options?: GeometryOptions): string {
	const angles = anglesArray(10);
	return (
		angles
			.map((angle, i) => {
				return `${i === 0 ? 'M' : 'L'}${radialPointString(
					angle,
					i % 2 === 1 ? radius * phi ** 2 : radius,
					options
				)}`;
			})
			.join() + 'Z'
	);
}

/** Points for a 5-pointed star
 * @params radius
 * @param options
 * @returns string svg polygon points
 */
export function starPoints(radius: number, options?: GeometryOptions): string {
	return anglesArray(10)
		.map((a, i) => radialPointString(a, i % 2 === 0 ? radius : radius * phi ** 2, options))
		.join(' ');
}

export function arrayMap(count: number, fn: (n: number) => number): number[] {
	return [...Array(count).keys()].map((n) => fn(n));
}

export function viewBox(width: number, height?: number): string {
	if (!height) height = width;
	return `${-width / 2} ${-height / 2} ${width} ${height}`;
}

/**
 * Return x, y coordinates of intersection of two lines
 * @params line1 Line
 * @params line2 Line
 * @returns Point
 */
export const intersection = (line1: Line, line2: Line): Point => {
	const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = line1;
	const [{ x: x3, y: y3 }, { x: x4, y: y4 }] = line2;
	const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

	let x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator;

	let y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator;

	if (x === -0) x = 0;
	if (y === -0) y = 0;

	return { x, y };
};
