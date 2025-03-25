<script lang="ts">
	import { GameClient } from '$lib/client/game.svelte'
	import Form from '$lib/components/Form.svelte'
	import LeaderBoard from '$lib/components/LeaderBoard.svelte'
	import type { LeaderBoardType } from '$lib/shared/schemas'

	type Props = {
		ctx: CanvasRenderingContext2D
		board: LeaderBoardType
	}

	let { board, ctx }: Props = $props()

	const game = new GameClient(ctx)

	let leaderboard_status = $state('')
	let is_open_dialog = $state(false)

	game.gameover_callback = () => {
		is_open_dialog = true
	}

	async function update_leaderboard() {
		const res = await fetch('/api/leaderboard')
		if (res.ok) {
			const res_json = await res.json()
			board = res_json.board
		} else {
			console.error("Couldn't fetch leaderboard")
		}
	}

	function start() {
		leaderboard_status = ''
		game.handle_start()
	}
</script>

<svelte:window onkeydown={(e) => game.handle_keydown(e.key)} />

<menu>
	<div>Score: {game.score}</div>
	<button onclick={start} disabled={game.playing}>Start</button>
</menu>

{#if board}
	<LeaderBoard {board} status={leaderboard_status} />
{/if}

<Form
	score={game.score}
	{update_leaderboard}
	bind:is_open_dialog
	bind:leaderboard_status
/>

<style>
	menu {
		padding-block: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: end;
		margin-bottom: 2rem;
	}
</style>
