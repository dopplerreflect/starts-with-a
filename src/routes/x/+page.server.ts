import type { PageServerLoad } from './$types';
import { readFile } from 'node:fs/promises';

export const load = (async ({ params, route }) => {
	const decoder = new TextDecoder('utf8');
	const source: ArrayBuffer = await readFile(`./src/routes${route.id}/+page.svelte`);
	return {
		source: decoder.decode(source).replace(/\t/g, '  ')
	};
}) satisfies PageServerLoad;
