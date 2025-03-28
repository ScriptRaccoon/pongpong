<script lang="ts">
	import { submit_score } from '$lib/client/scores'
	import { NameSchema } from '$lib/shared/schemas'

	type Props = {
		score: number
		form_visible: boolean
		dialog: HTMLDialogElement | null
		latest_score_id: number | null
		update_scores: () => Promise<void>
	}

	let {
		score,
		form_visible = $bindable(),
		dialog = $bindable(),
		latest_score_id = $bindable(),
		update_scores,
	}: Props = $props()

	let name = $state('')
	let error = $state('')
	let sending = $state(false)

	function close_dialog() {
		dialog?.close()
		form_visible = false
	}

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault()
		if (sending) return

		error = ''
		sending = true

		const { error: name_error } = NameSchema.safeParse(name)

		if (name_error) {
			error = name_error.errors[0]?.message ?? ''
			sending = false
			return
		}

		const { success, id } = await submit_score(name, score)

		if (id) latest_score_id = id

		if (success) {
			close_dialog()
			await update_scores()
		} else {
			error = 'Failed to submit score'
		}

		sending = false
	}
</script>

<dialog
	bind:this={dialog}
	onclose={() => {
		form_visible = false
	}}
>
	<form class="form" onsubmit={handle_submit}>
		<h2>
			Submit your score of <span>{score}</span>
		</h2>

		<p>Enter your name to save your score.</p>

		<div class="group">
			<label for="name_input">Name</label>
			<input type="text" id="name_input" bind:value={name} />
		</div>

		<menu>
			<button type="submit" disabled={sending}>Submit</button>
			<button type="button" onclick={close_dialog}>Cancel</button>
		</menu>

		<div class="error" aria-live="polite">
			{error}
		</div>

		<div aria-live="polite">
			{#if sending}
				Sending...
			{/if}
		</div>
	</form>
</dialog>

<style>
	h2 {
		margin-bottom: 0.5rem;
	}

	dialog {
		border: none;
		background-color: var(--card-color);
		color: inherit;
		padding: 1rem;
		border-radius: 0.4rem;
		box-shadow: 0 0 1rem #000;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(100vw, 30rem);
	}

	dialog::backdrop {
		backdrop-filter: blur(3px) brightness(0.5);
	}

	.group {
		margin-block: 0.75rem;
	}

	label {
		display: block;
		font-weight: bold;
	}

	menu {
		margin-block: 1rem;
		display: flex;
		gap: 0.5rem;
	}
</style>
