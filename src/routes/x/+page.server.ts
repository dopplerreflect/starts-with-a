import type { PageServerLoad } from './$types';
import { readFile } from 'node:fs/promises';

export const load = (async ({ route }) => {
	const source: ArrayBuffer = await readFile(`./src/routes${route.id}/+page.svelte`);
	const decoder = new TextDecoder('utf8');
	return {
		source: decoder.decode(source).replace(/\t/g, '  ')
	};
}) satisfies PageServerLoad;
