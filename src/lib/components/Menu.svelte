<script lang="ts">
	import { STATUS, type GameStatus } from '$lib/client/game.svelte'

	type Props = {
		status: GameStatus
		score: number
		start: () => void
		toggle_pause: () => void
	}

	let { status, score, start, toggle_pause }: Props = $props()
</script>

<menu>
	<div>
		Score: {score}
		{#if status === STATUS.GAMEOVER}
			&ndash; Game Over
		{/if}
	</div>
	<button
		disabled={status !== STATUS.PLAYING && status !== STATUS.PAUSED}
		onclick={toggle_pause}
	>
		{#if status === STATUS.PAUSED}
			Resume
		{:else}
			Pause
		{/if}
	</button>
	<button
		onclick={start}
		disabled={status === STATUS.PLAYING || status === STATUS.PAUSED}
	>
		Start
	</button>
</menu>

<style>
	menu {
		padding-block: 0.5rem;
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 1rem;
		margin-bottom: 2rem;
	}
</style>
