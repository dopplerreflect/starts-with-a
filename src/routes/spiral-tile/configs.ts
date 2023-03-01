import { writable } from 'svelte/store';
import { Φ } from '$lib/geometry';
export const configIndex = writable(0);

type Config = {
	zoom: number;
	count: number;
	gradient: {
		offset1: HSL;
		offset2: HSL;
	};
	level1: {
		fill: HSL;
		stroke: HSL;
	};
	level2: {
		fill: HSL;
		stroke: HSL;
	};
	level3: {
		fill: HSL;
		stroke: HSL;
	};
};

export const configs: Config[] = [
	{
		count: 233,
		zoom: Φ,
		gradient: {
			offset1: { hue: 90, sat: 100, lit: 20 },
			offset2: { hue: 120, sat: 100, lit: 50 }
		},
		level1: {
			fill: { hue: 120, sat: 100, lit: 50, alp: 0.05 },
			stroke: { hue: 120, sat: 100, lit: 50, alp: 0.05 }
		},
		level2: {
			fill: { hue: 90, sat: 100, lit: 50, alp: 0.2 },
			stroke: { hue: 60, sat: 100, lit: 10 }
		},
		level3: {
			fill: { hue: 120, sat: 100, lit: 50, alp: 0.2 },
			stroke: { hue: 60, sat: 100, lit: 10 }
		}
	},
	{
		count: 180,
		zoom: Φ,
		gradient: {
			offset1: { hue: 0, sat: 100, lit: 50 },
			offset2: { hue: 30, sat: 100, lit: 5 }
		},
		level1: {
			fill: { hue: 0, sat: 100, lit: 50, alp: 0.05 },
			stroke: { hue: 30, sat: 100, lit: 50, alp: 1 }
		},
		level2: {
			fill: { hue: 0, sat: 100, lit: 25, alp: 1 },
			stroke: { hue: 30, sat: 100, lit: 50 }
		},
		level3: {
			fill: { hue: 240, sat: 100, lit: 25, alp: 1 },
			stroke: { hue: 180, sat: 100, lit: 50 }
		}
	}
];
