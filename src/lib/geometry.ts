export const PHI = (Math.sqrt(5) + 1) / 2;

/**
 * Returns angles for a circle divided by count. Rotates -90deg.
 * @param count
 */
export function angles(count: number) {
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
	console.log(center);
	return {
		x: center.x + radius * Math.cos((angle + rotate) * (Math.PI / 180)),
		y: center.y + radius * Math.sin((angle + rotate) * (Math.PI / 180))
	};
}

/**
 * Returns an array of Points to draw a regular polygon
 * @param count
 * @param radius
 * @param center
 */
export function polygon(count: number, radius: number, options?: GeometryOptions): Point[] {
	return angles(count).map((angle) => radialPoint(angle, radius, options));
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
			.join() + 'Z'
	);
}
