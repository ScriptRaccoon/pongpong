<script lang="ts">
	import { ball } from '$lib/client/ball'
	import { player } from '$lib/client/player'
	import { CANVAS_HEIGHT, CANVAS_WIDTH } from '$lib/shared/config'
	import { NameSchema } from '$lib/shared/schemas'
	import './app.css'

	let { data } = $props()
	let board = $derived(data.board)

	let canvas = $state<HTMLCanvasElement | null>(null)
	let ctx = $derived(canvas?.getContext('2d'))

	let score = $state(0)
	let playing = $state(false)
	let name = $state('')
	let name_error = $state('')
	let form_error = $state('')
	let leaderboard_status = $state('')
	let dialog = $state<HTMLDialogElement | null>(null)
	let dialog_is_open = $state(false)

	$effect(() => {
		if (canvas) {
			canvas.width = CANVAS_WIDTH
			canvas.height = CANVAS_HEIGHT
		}
	})

	function open_dialog() {
		dialog?.showModal()
		dialog_is_open = true
	}

	function close_dialog() {
		dialog?.close()
		dialog_is_open = false
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

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault()
		name_error = ''

		const { error } = NameSchema.safeParse(name)

		if (error) {
			name_error = error.errors[0]?.message ?? ''
			return
		}

		try {
			const res = await fetch('/api/leaderboard', {
				method: 'POST',
				body: JSON.stringify({ name, score }),
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!res.ok) {
				throw new Error('Failed to submit score')
			}

			const res_json = await res.json()
			leaderboard_status = res_json?.message ?? ''

			await update_leaderboard()

			close_dialog()
		} catch (err) {
			console.error(err)
			form_error = 'Failed to submit score'
		}
	}

	function loop() {
		if (ctx) {
			clear_canvas(ctx)
			player.update(ctx)
			const action = ball.update(ctx, player)
			if (action === 'collision') handle_collision()
			else if (action === 'gameover') handle_gameover()
			player.draw(ctx)
			ball.draw(ctx)
		}

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
		open_dialog()
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

<header>
	<h1>Pong</h1>
</header>

<main>
	<section aria-label="game">
		<canvas bind:this={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
		<menu class="game-menu">
			<div>
				Score: {score}
			</div>
			<button onclick={handle_start} disabled={playing}>Start</button>
		</menu>
	</section>

	{#if board}
		<section>
			<h2>Leaderboard</h2>
			<table class="leaderboard">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Name</th>
						<th>Score</th>
						<th>Date</th>
					</tr>
				</thead>
				<tbody id="leaderboard_body">
					{#each board as entry, i}
						<tr>
							<td>#{i + 1}</td>
							<td>{entry.name}</td>
							<td>{entry.score}</td>
							<td>{new Date(entry.created_at).toLocaleDateString()}</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div>
				{leaderboard_status}
			</div>
		</section>
	{/if}

	{#if dialog_is_open}
		<div id="overlay" class="overlay"></div>
	{/if}

	<dialog bind:this={dialog} onclose={close_dialog}>
		<form class="form" onsubmit={handle_submit}>
			<h2>
				Submit your score of <span>{score}</span>
			</h2>
			<p>
				Enter your name to save your score to the leaderboard. It will only be
				added when you reach the top 5.
			</p>
			<div class="group">
				<label for="name_input">Name</label>
				<input
					type="text"
					id="name_input"
					aria-describedby="name_error"
					bind:value={name}
				/>
				<div class="error" id="name_error">
					{name_error}
				</div>
			</div>
			<menu>
				<button type="submit">Submit</button>
				<button type="button" onclick={close_dialog}>Cancel</button>
			</menu>
			<div class="error" id="form_error"></div>
		</form>
	</dialog>
</main>
