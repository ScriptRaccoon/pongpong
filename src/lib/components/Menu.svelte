<script lang="ts">
	import type { Game } from '$lib/client/game.svelte'

	type Props = { game: Game; start: () => void; toggle_pause: () => void }

	let { game, start, toggle_pause }: Props = $props()

	let first_time = $state(false)
</script>

<menu>
	<div>
		Score: {game.score}
		{#if game.gameover}
			&ndash; Game Over
		{/if}
	</div>
	<button disabled={!game.playing} onclick={toggle_pause}>
		{#if game.paused}
			Resume
		{:else}
			Pause
		{/if}
	</button>
	<button
		onclick={() => {
			first_time = false
			start()
		}}
		disabled={game.playing}
		class:attention={first_time}
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
