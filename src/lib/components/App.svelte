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

	let form_visible = $state(false)
	let show_all_scores = $state(false)
	let dialog = $state<HTMLDialogElement | null>(null)

	game.on_gameover(() => {
		if (game.score > 0 && dialog) {
			form_visible = true
			dialog.showModal()
		}
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

	async function submit_score(
		name: string,
		score: number,
	): Promise<{ success: boolean }> {
		try {
			const res = await fetch('/api/scores', {
				method: 'POST',
				body: JSON.stringify({ name, score }),
				headers: { 'Content-Type': 'application/json' },
			})
			return { success: res.ok }
		} catch (err) {
			console.error(err)
			return { success: false }
		}
	}

	function toggle_show_all() {
		show_all_scores = !show_all_scores
		update_scores()
	}

	$effect(() => {
		update_scores()
	})

	function close_form() {
		form_visible = false
	}
</script>

<svelte:window onkeydown={(e) => game.handle_keydown(e.key)} />

<Menu
	status={game.status}
	score={game.score}
	start={() => game.handle_start()}
	toggle_pause={() => game.toggle_pause()}
/>

<Scores {scores} {show_all_scores} {toggle_show_all} />

<Form
	score={game.score}
	{form_visible}
	submit={submit_score}
	close={close_form}
	{update_scores}
	bind:dialog
/>
