<script lang="ts">
	import { STATUS, type GameStatus } from '$lib/client/Game.svelte'

	type Props = {
		status: GameStatus
		score: number
		start: () => void
		toggle_pause: () => void
		form_visible: boolean
	}

	let { status, score, start, toggle_pause, form_visible }: Props = $props()
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
			Resume [p]
		{:else}
			Pause [p]
		{/if}
	</button>
	<button
		onclick={start}
		disabled={status === STATUS.PLAYING || status === STATUS.PAUSED || form_visible}
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
		margin-bottom: 1rem;
	}
</style>
