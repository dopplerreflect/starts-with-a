import { writable } from 'svelte/store';
import { Φ } from '$lib/geometry';
export const configIndex = writable(0);

type Config = {
	zoom: number;
	count: number;
};

export const configs: Config[] = [
	{ count: 180, zoom: Φ },
	{ count: 64, zoom: 1 },
	{ count: 128, zoom: Φ },
	{ count: 360, zoom: Φ }
];

function handleUpDownKeys(event: KeyboardEvent) {
	switch (event.key) {
		case 'ArrowUp':
			configIndex.update((i) => (i === 0 || i < configs.length - 1 ? i + 1 : 0));
			break;
		case 'ArrowDown':
			configIndex.update((i) => (i === 0 ? configs.length - 1 : i - 1));
			break;
		default:
			break;
	}
}

export function configChanger() {
	document.addEventListener('keydown', handleUpDownKeys);
	return () => document.removeEventListener('keydown', handleUpDownKeys);
}
