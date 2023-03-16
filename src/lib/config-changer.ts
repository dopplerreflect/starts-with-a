import type { Writable } from 'svelte/store';

function configKeyHandler(event: KeyboardEvent, configIndex: Writable<number>, configs: object[]) {
	switch (event.key) {
		case 'ArrowRight':
			configIndex.update((i) => (i === 0 || i < configs.length - 1 ? i + 1 : 0));
			break;
		case 'ArrowLeft':
			configIndex.update((i) => (i === 0 ? configs.length - 1 : i - 1));
			break;
		default:
			break;
	}
}

export function configChanger(configIndex: Writable<number>, configs: object[]) {
	document.addEventListener('keydown', (event) => configKeyHandler(event, configIndex, configs));
	return () =>
		document.removeEventListener('keydown', (event) =>
			configKeyHandler(event, configIndex, configs)
		);
}
