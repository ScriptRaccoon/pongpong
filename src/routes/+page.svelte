<script lang="ts">
	import App from '$lib/components/App.svelte'
	import { CANVAS_HEIGHT, CANVAS_WIDTH } from '$lib/shared/config.js'

	let canvas = $state<HTMLCanvasElement | null>(null)

	let { data } = $props()
</script>

<canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} bind:this={canvas}></canvas>

{#if canvas && data.board}
	<App board={data.board} {canvas} />
{/if}

<style>
	canvas {
		outline: 2px solid #555;
		border-radius: 0.25rem;
		display: block;
	}
</style>
