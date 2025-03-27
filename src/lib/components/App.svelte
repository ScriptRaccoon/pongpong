<script lang="ts">
	import { type Game } from '$lib/client/game.svelte'
	import Form from '$lib/components/Form.svelte'
	import Scores from '$lib/components/Scores.svelte'
	import { LEADERBOARD_SIZE } from '$lib/shared/config'
	import { ScoreListSchema, type ScoreList } from '$lib/shared/schemas'
	import Menu from './Menu.svelte'

	type Props = { game: Game }

	let { game }: Props = $props()

	let scores = $state<ScoreList | null>(null)

	let scores_status = $state('')
	let is_open_dialog = $state(false)
	let show_all_scores = $state(false)

	game.on_gameover(() => {
		if (game.score > 0) is_open_dialog = true
	})

	async function update_scores() {
		try {
			const url = show_all_scores
				? '/api/scores'
				: `/api/scores?limit=${LEADERBOARD_SIZE}`
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
	}

	function toggle_show_all() {
		show_all_scores = !show_all_scores
		update_scores()
	}

	$effect(() => {
		update_scores()
	})
</script>

<svelte:window onkeydown={(e) => game.handle_keydown(e.key)} />

<Menu
	status={game.status}
	score={game.score}
	{start}
	toggle_pause={() => game.toggle_pause()}
/>

<Scores {scores} status={scores_status} {show_all_scores} {toggle_show_all} />

<Form score={game.score} {update_scores} bind:is_open_dialog bind:scores_status />
