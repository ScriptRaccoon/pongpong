<script lang="ts">
	import { type ScoreList } from '$lib/shared/schemas'
	import TextLoader from './TextLoader.svelte'

	type Props = {
		scores: ScoreList | null
		show_all_scores: boolean
		latest_score_id: number | null
		toggle_show_all: () => void
	}

	let { scores, show_all_scores, latest_score_id, toggle_show_all }: Props = $props()

	let title = $derived(show_all_scores ? 'All scores' : 'Leaderboard')
</script>

<section>
	<header>
		<h2>{title}</h2>
		<label>
			Show all scores
			<input type="checkbox" checked={show_all_scores} onchange={toggle_show_all} />
		</label>
	</header>
	{#if scores}
		<table>
			<thead>
				<tr>
					<th>Rank</th>
					<th>Name</th>
					<th>Score</th>
					<th>Date</th>
				</tr>
			</thead>
			<tbody>
				{#each scores as entry, i (entry.id)}
					<tr class:highlight={latest_score_id === entry.id}>
						<td>#{i + 1}</td>
						<td>{entry.name}</td>
						<td>{entry.score}</td>
						<td>{new Date(entry.created_at).toLocaleDateString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<TextLoader />
	{/if}
</section>

<style>
	section {
		margin-top: 1rem;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		border: 1px solid var(--card-color);
	}

	thead {
		background-color: var(--card-color);
	}

	:is(td, th) {
		padding: 0.4rem 0.8rem;
		text-align: left;
		white-space: nowrap;
	}

	tr:nth-child(even) {
		background-color: var(--secondary-bg-color);
	}

	header,
	label {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	label {
		gap: 0.5rem;
	}

	tr.highlight {
		outline: 1px solid var(--accent-color);
	}
</style>
