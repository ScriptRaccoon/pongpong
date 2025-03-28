<script lang="ts">
	import { Game } from '$lib/client/Game.svelte'
	import App from '$lib/components/App.svelte'
	import Instructions from '$lib/components/Instructions.svelte'
	import { CANVAS_HEIGHT, CANVAS_WIDTH } from '$lib/shared/config.js'

	let game: Game | null = null

	function create_game(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext('2d')
		if (!ctx) throw new Error('Could not get 2d context')
		game = new Game(ctx)
		game.draw()
	}
</script>

<Instructions />

<canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} use:create_game></canvas>

{#if game}
	<App {game} />
{/if}

<style>
	canvas {
		background-color: var(--black-color);
		outline: 2px solid var(--card-color);
		border-radius: 0.25rem;
		display: block;
	}
</style>
