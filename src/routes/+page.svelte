<script lang="ts">
	import { ball } from '$lib/client/ball'
	import { player } from '$lib/client/player'
	import Form from '$lib/components/Form.svelte'
	import Game from '$lib/components/Game.svelte'
	import LeaderBoard from '$lib/components/LeaderBoard.svelte'

	let { data } = $props()
	let board = $derived(data.board)

	let canvas = $state<HTMLCanvasElement | null>(null)
	let ctx = $derived(canvas?.getContext('2d'))

	let score = $state(0)
	let playing = $state(false)
	let leaderboard_status = $state('')
	let is_open_dialog = $state(false)

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

	function loop() {
		if (!ctx) return
		clear_canvas(ctx)
		player.update(ctx)
		const action = ball.update(ctx, player)
		if (action === 'collision') handle_collision()
		else if (action === 'gameover') handle_gameover()
		player.draw(ctx)
		ball.draw(ctx)
		if (playing) requestAnimationFrame(loop)
	}

	function handle_keydown(e: KeyboardEvent) {
		if (!playing) return
		if (e.key === 'ArrowUp') {
			player.move_up()
		} else if (e.key === 'ArrowDown') {
			player.move_down()
		}
	}

	function handle_start() {
		score = 0
		leaderboard_status = ''
		if (ctx) ball.reset(ctx)
		playing = true
		loop()
	}

	function handle_collision() {
		score++
	}

	function handle_gameover() {
		playing = false
		is_open_dialog = true
	}

	function clear_canvas(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	}
</script>

<svelte:window onkeydown={handle_keydown} />

<!-- temporary button -->
<button
	onclick={() => {
		fetch('/api/leaderboard', { method: 'DELETE' })
	}}>Clear leaderboard</button
>

<Game {score} bind:canvas {playing} {handle_start} />

{#if board}
	<LeaderBoard {board} status={leaderboard_status} />
{/if}

<Form {score} {update_leaderboard} bind:is_open_dialog />
