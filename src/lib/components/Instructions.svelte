<script lang="ts">
	import { slide } from 'svelte/transition'

	let show_instructions = $state(true)

	function close_instructions() {
		show_instructions = false
	}
</script>

{#if show_instructions}
	<div transition:slide={{ duration: 150 }}>
		<p>
			<strong>Instructions.</strong>
			Control the two paddles with the keys
			<kbd>&uarr;</kbd> <kbd>&darr;</kbd>. Each ball hit gives you a point. Watch
			out for deviators (blue) and accelerators (red)!
		</p>
		<button onclick={close_instructions}>Ok</button>
	</div>
{/if}

<style>
	div {
		display: grid;
		align-items: center;
		grid-template-columns: 1fr auto;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	p {
		color: var(--secondary-text-color);
	}

	kbd {
		background-color: var(--card-color);
		padding-inline: 0.4rem;
		color: var(--text-color);
		border-radius: 0.2rem;
		font-size: 1.125rem;
		box-shadow: 1px 1px #fff4;
	}
</style>
