<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	let path: string;

	$: path = $page.url.pathname.replace('/', '');
</script>

<div id="container">
	<header>
		<ul>
			{#each data.pages as page}
				<li>
					{#if path === page}
						{page}
					{:else}
						<a href="/{page}">{page}</a>
					{/if}
				</li>
			{/each}
		</ul>
	</header>

	<main>
		<slot />
	</main>
</div>

<style global>
	html,
	body {
		margin: 0;
		padding: 0;
		font-family: Arial, Helvetica, sans-serif;
	}
	body,
	a {
		color: white;
	}
	#container {
		height: 100vh;
		display: grid;
		grid-template-rows: 2em 1fr;
		background-color: hsl(220, 100%, 5%);
	}
	header {
		display: flex;
		height: 2em;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
	}
	main {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	ul {
		padding: 0;
		margin: 0;
	}
	li {
		display: inline-block;
		list-style-type: none;
	}
	li::after {
		content: ',';
	}
	li:last-child::after {
		content: '';
	}
	svg {
		max-height: calc(100vh - 4em);
		max-width: calc(100vh - 4em);
	}
</style>
