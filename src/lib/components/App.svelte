<script lang="ts">
	import { type Game } from '$lib/client/game.svelte'
	import Form from '$lib/components/Form.svelte'
	import LeaderBoard from '$lib/components/LeaderBoard.svelte'
	import { LeaderBoardSchema, type LeaderBoardType } from '$lib/shared/schemas'
	import { is_score_good_enough } from '$lib/shared/utils'

	type Props = { game: Game }

	let { game }: Props = $props()

	let board = $state<LeaderBoardType | null>(null)

	let leaderboard_status = $state('')
	let is_open_dialog = $state(false)
	let first_time = $state(true)

	game.on_gameover(() => {
		if (!board || is_score_good_enough(game.score, board)) {
			is_open_dialog = true
		}
	})

	async function update_leaderboard() {
		try {
			const res = await fetch('/api/leaderboard')
			if (!res.ok) {
				throw new Error("Couldn't fetch leaderboard")
			}
			const res_json = await res.json()
			board = LeaderBoardSchema.parse(res_json.board)
		} catch (err) {
			console.error(err)
		}
	}

	function start() {
		leaderboard_status = ''
		game.handle_start()
		first_time = false
	}

	$effect(() => {
		update_leaderboard()
	})
</script>

<svelte:window onkeydown={(e) => game.handle_keydown(e.key)} />

<menu>
	<div>
		Score: {game.score}
		{#if game.gameover}
			&ndash; Game Over
		{/if}
	</div>
	<button disabled={!game.playing} onclick={() => game.toggle_pause()}>
		{#if game.paused}
			Resume
		{:else}
			Pause
		{/if}
	</button>
	<button onclick={start} disabled={game.playing} class:attention={first_time}>
		Start
	</button>
</menu>

<LeaderBoard {board} status={leaderboard_status} />

<Form
	score={game.score}
	{update_leaderboard}
	bind:is_open_dialog
	bind:leaderboard_status
/>

<style>
	menu {
		padding-block: 0.5rem;
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 1rem;
		margin-bottom: 2rem;
	}
</style>
