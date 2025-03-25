<script lang="ts">
	import { NameSchema } from '$lib/shared/schemas'
	import Overlay from './Overlay.svelte'

	type Props = {
		score: number
		is_open_dialog: boolean
		update_leaderboard: (message?: string) => Promise<void>
	}

	let { score, is_open_dialog = $bindable(), update_leaderboard }: Props = $props()

	let name = $state('')
	let name_error = $state('')
	let form_error = $state('')

	let dialog = $state<HTMLDialogElement | null>(null)

	$effect(() => {
		if (is_open_dialog) dialog?.showModal()
	})

	function close_dialog() {
		dialog?.close()
		is_open_dialog = false
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
			const leaderboard_status = res_json?.message ?? ''

			await update_leaderboard(leaderboard_status)

			close_dialog()
		} catch (err) {
			console.error(err)
			form_error = 'Failed to submit score'
		}
	}

	$inspect(is_open_dialog)
</script>

{#if is_open_dialog}
	<Overlay />
{/if}

<dialog bind:this={dialog} onclose={close}>
	<form class="form" onsubmit={handle_submit}>
		<h2>
			Submit your score of <span>{score}</span>
		</h2>
		<p>
			Enter your name to save your score to the leaderboard. It will only be added
			when you reach the top 5.
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
		<div class="error" id="form_error">
			{form_error}
		</div>
	</form>
</dialog>

<style>
	dialog {
		border: none;
		outline: none;
		background-color: #333;
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

	form {
		z-index: 1;
	}

	.group {
		margin-block: 0.75rem;
	}

	label {
		display: block;
		font-weight: bold;
	}

	menu {
		margin-top: 1rem;
		display: flex;
		gap: 0.5rem;
	}

	.error {
		color: yellow;
	}
</style>
