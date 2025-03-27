<script lang="ts">
	import { NameSchema } from '$lib/shared/schemas'
	import Overlay from './Overlay.svelte'

	type Props = {
		score: number
		form_visible: boolean
		submit: (name: string, score: number) => Promise<{ success: boolean }>
		close: () => void
		update_scores: () => Promise<void>
		dialog: HTMLDialogElement | null
	}

	let {
		score,
		form_visible,
		submit,
		close,
		update_scores,
		dialog = $bindable(),
	}: Props = $props()

	let name = $state('')
	let name_error = $state('')
	let form_error = $state('')
	let form_disabled = $state(false)
	let form_status = $state('')

	function close_dialog() {
		dialog?.close()
		close()
	}

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault()
		if (form_disabled) return

		name_error = ''
		form_status = 'Sending...'
		form_disabled = true

		const { error } = NameSchema.safeParse(name)

		if (error) {
			name_error = error.errors[0]?.message ?? ''
			form_disabled = false
			form_status = ''
			return
		}

		const { success } = await submit(name, score)

		form_disabled = false
		form_status = ''

		if (success) {
			close_dialog()
			await update_scores()
		} else {
			form_error = 'Failed to submit score'
		}
	}
</script>

<Overlay show={form_visible} />

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
			<input
				type="text"
				id="name_input"
				aria-describedby="name_error"
				bind:value={name}
			/>
			<div class="error" id="name_error" aria-live="polite">
				{name_error}
			</div>
		</div>
		<menu>
			<button type="submit" disabled={form_disabled}>Submit</button>
			<button type="button" onclick={close_dialog}>Cancel</button>
		</menu>

		<div class="error" aria-live="polite">
			{form_error}
		</div>

		<div aria-live="polite">
			{form_status}
		</div>
	</form>
</dialog>

<style>
	dialog {
		border: none;
		outline: none;
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
