<script lang="ts">
	import { fade } from 'svelte/transition'

	let { show = false } = $props()
</script>

{#if show}
	<div class="overlay" transition:fade={{ duration: 150 }}></div>
{/if}

<style>
	.overlay {
		pointer-events: none;
		position: fixed;
		inset: 0;
		backdrop-filter: blur(3px) brightness(0.5);
	}
</style>
