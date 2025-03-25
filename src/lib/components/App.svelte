<script lang="ts">
	import { Game } from '$lib/client/game.svelte'
	import Form from '$lib/components/Form.svelte'
	import LeaderBoard from '$lib/components/LeaderBoard.svelte'
	import type { LeaderBoardType } from '$lib/shared/schemas'

	type Props = {
		canvas: HTMLCanvasElement
		board: LeaderBoardType
	}

	let { board, canvas }: Props = $props()

	const game = new Game(canvas)

	let leaderboard_status = $state('')
	let is_open_dialog = $state(false)

	game.gameover_callback = () => {
		is_open_dialog = true
	}

	async function update_leaderboard(message?: string) {
		const res = await fetch('/api/leaderboard')
		if (res.ok) {
			const res_json = await res.json()
			board = res_json.board
		} else {
			console.error("Couldn't fetch leaderboard")
		}

		if (message) leaderboard_status = message
	}

	function start() {
		leaderboard_status = ''
		game.handle_start()
	}
</script>

<svelte:window onkeydown={game.handle_keydown.bind(game)} />

<menu>
	<div>Score: {game.score}</div>
	<button onclick={start} disabled={game.playing}>Start</button>
</menu>

{#if board}
	<LeaderBoard {board} status={leaderboard_status} />
{/if}

<Form score={game.score} {update_leaderboard} bind:is_open_dialog />

<style>
	menu {
		padding-block: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: end;
	}
</style>
