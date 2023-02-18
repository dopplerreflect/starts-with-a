export const Φ = (Math.sqrt(5) + 1) / 2;
export const φ = Φ - 1;
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
		x: center.x + radius * Math.cos((angle + rotate) * (Math.PI / 180)),
		y: center.y + radius * Math.sin((angle + rotate) * (Math.PI / 180))
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
					i % 2 === 1 ? radius * φ ** 2 : radius,
					options
				)}`;
			})
			.join() + 'Z'
	);
}
