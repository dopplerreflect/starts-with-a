export const Phi = (Math.sqrt(5) + 1) / 2;
export const phi = Phi - 1;
export const SQRT3 = Math.sqrt(3);

/**
 * Returns angles for a circle divided by count. Rotates -90deg.
 * @param count
 * @param rotate
 */
export function anglesArray(count: number, rotate: number = -90) {
	return [...Array(count).keys()].map((i) => (360 / count) * i + rotate);
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
	let point: Point = radialPoint(angle, radius, options);
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
	return [
		'M',
		...angles.map((angle, i) =>
			pointToString(radialPoint(angle, i % 2 === 1 ? radius * phi ** 2 : radius, options))
		),
		'Z'
	].join(' ');
}

export function pentagram(radius: number, options?: GeometryOptions): string {
	const angles = anglesArray(5);
	return `M${[0, 2, 4, 1, 3].map((i) => radialPointString(angles[i], radius, options)).join('L')}Z`;
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

export const multiCircleIntersections = (circles: Circle[]): Point[] => {
	let circlePairsJSON: string[] = [];
	for (let i = 0; i < circles.length; i++) {
		circles.slice(i + 1, circles.length).forEach((c) => {
			circlePairsJSON.push(JSON.stringify([circles[i], c]));
		});
	}
	const intersectionJSONSet: Set<string> = new Set();
	circlePairsJSON.forEach((cpj) => {
		let cp = JSON.parse(cpj);
		let ij = JSON.stringify(circleIntersections(cp[0], cp[1]));
		intersectionJSONSet.add(ij);
	});
	return [...intersectionJSONSet].map((ij) => JSON.parse(ij)).flat();
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

export const lineToPath = (line: Line): string =>
	`M${line[0].x} ${line[0].y}L${line[1].x} ${line[1].y}`;

export const pointToString = (p: Point): string => `${p.x} ${p.y}`;

export const midpoint = (l: Line): Point => ({
	x: (l[0].x + l[1].x) / 2,
	y: (l[0].y + l[1].y) / 2
});

export const slope = (l: Line): number => (l[1].y - l[0].y) / (l[1].x - l[0].x);

export const missingX = (knownPoint: Point, knownY: number, slope: number): number =>
	(knownY - knownPoint.y) / slope + knownPoint.x;

export const missingY = (knownPoint: Point, knownX: number, slope: number): number =>
	(knownX - knownPoint.x) * slope + knownPoint.y;

/**
 * Return length of chord given angle in radians and radius.
 */
export const chordLength = (angle: number, radius: number): number =>
	2 * radius * Math.sin(angle / 2);

export function pathFromIntersectionsOfLines(array: Array<Line | 'M' | 'Z'>): string {
	const intermediateArray = [];
	for (let i = 0; i < array.length; i++) {
		let input = [array[i], array[i + 1]];
		if (input[0] === 'M' || input[0] === 'Z') {
			intermediateArray.push(input[0]);
			continue;
		}
		if (input[1] === 'M' || input[1] === 'Z') continue;
		intermediateArray.push(pointToString(intersection(input[0], input[1])));
	}
	return intermediateArray.join(' ');
}

/**
 * Pythagorean hypotenuse
 * @param b Length of a short side
 * @param c Length of a short side
 * @returns Length of hypotenuse
 */
export function pythag(b: number, c: number): number {
	return Math.sqrt(b ** 2 + c ** 2);
}

/**
 * Pythagorean short side
 * @param a Length of a hypotenuse
 * @param c Length of a short side
 * @returns Length of other short side
 */
export function pythag2(a: number, b: number): number {
	return Math.sqrt(a ** 2 - b ** 2);
}

/**
 * Angle in degrees from [0, 0]
 * @param y
 * @param x
 * @returns angle
 */
export function tan(y: number, x: number): number {
	return (Math.atan2(y, x) * 180) / Math.PI;
}

/**
 * SVG Path from an array of Points
 * @param points
 * @returns string path
 */
export function pathFromPoints(points: Point[]): string {
	return ['M', ...points.map((p) => `${p.x} ${p.y}`), 'Z'].join(' ');
}
