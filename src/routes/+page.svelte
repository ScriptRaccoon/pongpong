<script lang="ts">
	import App from '$lib/components/App.svelte'
	import { CANVAS_HEIGHT, CANVAS_WIDTH } from '$lib/shared/config.js'

	let canvas = $state<HTMLCanvasElement | null>(null)
	let ctx = $derived(canvas?.getContext('2d') ?? null)
</script>

<p>
	Control the two paddles with the keys
	<kbd>Up</kbd> / <kbd>Down</kbd>.
	<br />
	Watch out for deviators and accelerators!
</p>

<canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} bind:this={canvas}></canvas>

{#if ctx}
	<App {ctx} />
{/if}

<style>
	p {
		color: var(--secondary-text-color);
		margin-bottom: 1rem;
	}

	canvas {
		background-color: var(--black-color);
		outline: 2px solid var(--card-color);
		border-radius: 0.25rem;
		display: block;
	}
</style>
