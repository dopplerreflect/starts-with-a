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
		count: 180,
		zoom: Φ,
		gradient: {
			offset1: {
				hue: 0,
				lit: 50
			},
			offset2: {
				hue: 30,
				lit: 5
			}
		},
		level1: {
			fill: {
				hue: 0,
				sat: 100,
				lit: 50,
				alp: 0.05
			},
			stroke: {
				hue: 30,
				sat: 100,
				lit: 50,
				alp: 1
			}
		},
		level2: {
			fill: {
				hue: 0
			},
			stroke: {
				hue: 30
			}
		},
		level3: {
			fill: {
				hue: 240
			},
			stroke: {
				hue: 180
			}
		}
	}
];
