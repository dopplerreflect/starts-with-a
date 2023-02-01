import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { readdir } from 'node:fs/promises';

export const load = (async () => {
	const pages = (await readdir('./src/routes', { withFileTypes: true }))
		.filter((e) => e.isDirectory())
		.map((e) => e.name);

	if (pages) {
		console.log(pages);
		return { pages };
	}

	throw error(404, 'Not found');
}) satisfies LayoutServerLoad;
