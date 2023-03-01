<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	let path: string;
	$: path = $page.url.pathname.replace('/', '');
	let pageIndex = -1;
	function handleKeyDown(event: KeyboardEvent) {
		let { key } = event;
		switch (key) {
			case 'ArrowRight':
				pageIndex = pageIndex === data.pages.length - 1 ? 0 : pageIndex + 1;
				break;
			case 'ArrowLeft':
				pageIndex = pageIndex < 1 ? data.pages.length - 1 : pageIndex - 1;
				break;
			default:
				return;
		}
		goto(data.pages[pageIndex]);
	}
	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	});
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
		height: calc(100vh - 2em);
		overflow: hidden;
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
</style>
