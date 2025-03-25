<script lang="ts">
	import Header from '$lib/components/Header.svelte'
	import { CANVAS_WIDTH } from '$lib/shared/config'
	import './app.css'
</script>

<svelte:head>
	<title>Pong</title>
</svelte:head>

<Header />

<main style="width: {CANVAS_WIDTH}px">
	<slot></slot>
</main>

<style>
	main {
		margin-inline: auto;
	}
</style>
