<script lang="ts">
	import { type Game } from '$lib/client/game.svelte'
	import Form from '$lib/components/Form.svelte'
	import Scores from '$lib/components/Scores.svelte'
	import { type ScoreList } from '$lib/shared/schemas'
	import { onMount } from 'svelte'
	import Menu from './Menu.svelte'
	import { ScoreClient } from '$lib/client/scores'

	type Props = { game: Game }

	let { game }: Props = $props()

	let scores = $state<ScoreList | null>(null)

	let form_visible = $state(false)
	let show_all_scores = $state(false)
	let dialog = $state<HTMLDialogElement | null>(null)
	let latest_score_id = $state<number | null>(null)

	game.ongameover(() => {
		if (game.score > 0 && dialog) {
			form_visible = true
			dialog.showModal()
		}
	})

	async function update_scores() {
		const updated_scores = await ScoreClient.fetch_scores(show_all_scores)
		if (updated_scores) scores = updated_scores
	}

	function toggle_show_all_scores() {
		show_all_scores = !show_all_scores
		update_scores()
	}

	function start() {
		game.start()
	}

	onMount(() => {
		update_scores()
	})
</script>

<svelte:window onkeydown={(e) => game.handle_keydown(e.key)} />

<Menu
	status={game.status}
	score={game.score}
	{start}
	toggle_pause={() => game.toggle_pause()}
	{form_visible}
/>

{#if game.error_message}
	<p class="error">{game.error_message}</p>
{/if}

<Scores
	{scores}
	{show_all_scores}
	{latest_score_id}
	toggle_show_all={toggle_show_all_scores}
/>

<Form
	score={game.score}
	bind:form_visible
	bind:dialog
	bind:latest_score_id
	{update_scores}
/>
