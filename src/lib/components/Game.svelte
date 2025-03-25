<script lang="ts">
	import { CANVAS_HEIGHT, CANVAS_WIDTH } from '$lib/shared/config'

	type Props = {
		score: number
		canvas: HTMLCanvasElement | null
		playing: boolean
		handle_start: () => void
	}

	let { score, canvas = $bindable(), playing, handle_start }: Props = $props()
</script>

<section aria-label="game">
	<canvas bind:this={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
	<menu class="game-menu">
		<div>Score: {score}</div>
		<button onclick={handle_start} disabled={playing}>Start</button>
	</menu>
</section>

<style>
	canvas {
		outline: 2px solid #555;
		border-radius: 0.25rem;
		display: block;
	}

	.game-menu {
		padding-block: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: end;
	}
</style>
