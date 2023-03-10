type Point = {
	x: number;
	y: number;
};

type Polygon = Point[];

type GeometryOptions = {
	center?: Point = { x: 0, y: 0 };
	rotate?: number;
};
