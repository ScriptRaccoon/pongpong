<script lang="ts">
	import { type Game } from '$lib/client/game.svelte'
	import Form from '$lib/components/Form.svelte'
	import Scores from '$lib/components/Scores.svelte'
	import { LEADERBOARD_SIZE } from '$lib/shared/config'
	import { ScoreListSchema, type ScoreList } from '$lib/shared/schemas'

	type Props = { game: Game }

	let { game }: Props = $props()

	let scores = $state<ScoreList | null>(null)

	let scores_status = $state('')
	let is_open_dialog = $state(false)
	let first_time = $state(true)
	let show_all_scores = $state(false)

	game.on_gameover(() => {
		if (game.score > 0) is_open_dialog = true
	})

	async function update_scores(show_all: boolean = true) {
		try {
			const url = show_all ? '/api/scores' : `/api/scores?limit=${LEADERBOARD_SIZE}`
			const res = await fetch(url)
			if (!res.ok) {
				throw new Error("Couldn't fetch scores")
			}
			const res_json = await res.json()
			scores = ScoreListSchema.parse(res_json.scores)
		} catch (err) {
			console.error(err)
		}
	}

	function start() {
		scores_status = ''
		game.handle_start()
		first_time = false
	}

	$effect(() => {
		update_scores(show_all_scores)
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

<Scores {scores} status={scores_status} bind:show_all={show_all_scores} />

<Form
	score={game.score}
	update_scores={() => update_scores(show_all_scores)}
	bind:is_open_dialog
	bind:scores_status
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
