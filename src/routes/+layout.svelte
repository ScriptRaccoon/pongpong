<script lang="ts">
	import Header from '$lib/components/Header.svelte'
	import './app.css'
</script>

<svelte:head>
	<title>Pong</title>
</svelte:head>

<Header />

<main>
	<slot></slot>
</main>

<style>
	main {
		width: 600px;
		margin-inline: auto;
	}
</style>
