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

	let x = Number(
		(((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator).toFixed(1)
	);

	let y = Number(
		(((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator).toFixed(1)
	);

	// if (x === -0) x = 0;
	// if (y === -0) y = 0;

	return { x, y };
};

/**
 *
 * @param c1
 * @param c2
 * @returns Line ending at each of two intersections
 */
export const circleIntersections = (c1: Circle, c2: Circle): Line => {
	let dx = c2.x - c1.x;
	let dy = c2.y - c1.y;
	const d = Math.sqrt(dx ** 2 + dy ** 2);
	dx /= d;
	dy /= d;
	const a = (c1.r ** 2 - c2.r ** 2 + d ** 2) / (2 * d);
	const px = c1.x + a * dx;
	const py = c1.y + a * dy;
	const h = Math.sqrt(c1.r ** 2 - a ** 2);

	return [
		{ x: Number((px + h * dy).toFixed(2)), y: Number((py - h * dx).toFixed(2)) },
		{ x: Number((px - h * dy).toFixed(2)), y: Number((py + h * dx).toFixed(2)) }
	];
};

/**
 *
 * @param circle
 * @param line
 * @returns zero to two Points where Line intesects Circle
 */
export const circleLineIntersections = (circle: Circle, line: Line): Point[] => {
	let v1 = {
		x: line[1].x - line[0].x,
		y: line[1].y - line[0].y
	};
	let v2 = {
		x: line[0].x - circle.x,
		y: line[0].y - circle.y
	};
	let b = (v1.x * v2.x + v1.y * v2.y) * -2;
	let c = (v1.x ** 2 + v1.y ** 2) * 2;
	let d = Math.sqrt(b ** 2 - 2 * c * (v2.x ** 2 + v2.y ** 2 - circle.r ** 2));
	if (isNaN(d)) return [];
	let u1 = (b - d) / c;
	let u2 = (b + d) / c;
	let points = [];
	if (u1 <= 1 && u1 >= 0) {
		points.push({
			x: Number((line[0].x + v1.x * u1).toFixed(2)),
			y: Number((line[0].y + v1.y * u1).toFixed(2))
		});
	}
	if (u2 <= 1 && u2 >= 0) {
		points.push({
			x: Number((line[0].x + v1.x * u2).toFixed(2)),
			y: Number((line[0].y + v1.y * u2).toFixed(2))
		});
	}
	return points;
};

export const phylotaxicPoints = (
	count: number,
	outerRadius: number,
	radialPointOptions?: GeometryOptions
): Point[] =>
	[...Array(count).keys()].map((k) => {
		let r = (outerRadius / count) * k;
		return radialPoint((360 - 360 * phi) * k, r, radialPointOptions);
	});
