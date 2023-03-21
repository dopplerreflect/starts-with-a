<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	let path: string;
	$: path = $page.url.pathname.replace('/', '');
	let pageIndex = -1;
	let nav: HTMLElement;
	function toggleNav() {
		nav.classList.toggle('open');
	}
	function handleKeyDown(event: KeyboardEvent) {
		let { key } = event;
		switch (key) {
			case 'ArrowDown':
				if (!nav.classList.contains('open')) break;
				pageIndex = pageIndex === data.pages.length - 1 ? 0 : pageIndex + 1;
				break;
			case 'ArrowUp':
				if (!nav.classList.contains('open')) break;
				pageIndex = pageIndex < 1 ? data.pages.length - 1 : pageIndex - 1;
				break;
			case 'm':
				toggleNav();
				break;
			default:
				return;
		}
		data.pages[pageIndex] && goto(data.pages[pageIndex]);
	}
	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	});
</script>

<svelte:head>
	<title>{path}</title>
</svelte:head>

<div id="container">
	<nav bind:this={nav} class="">
		<ul>
			{#each data.pages as page}
				{#if path === page}
					<li class="active">{page}</li>
				{:else}
					<li><a href="/{page}">{page}</a></li>
				{/if}
			{/each}
		</ul>
	</nav>

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
		position: relative;
		background-color: hsl(220, 100%, 5%);
	}
	nav {
		background-color: hsla(220, 50%, 5%, 0.75);
		border-right: 1px solid white;
		position: absolute;
		top: 0;
		left: -34vh;
		height: 100vh;
		width: 33vh;
		flex-direction: row;
		transition: all 0.25s;
	}
	nav.open {
		left: 0;
		transition: all 0.25s;
	}
	main {
		height: 100lvh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	a {
		text-decoration: none;
	}
	ul {
		padding: 0;
		margin: 0;
	}
	li {
		padding-left: 1em;
		list-style-type: none;
		font-size: 1.5em;
	}
	li.active {
		background-color: hsla(220, 100%, 50%, 0.75);
	}
</style>
