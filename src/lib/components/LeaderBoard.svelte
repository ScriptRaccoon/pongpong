<script lang="ts">
	import { type LeaderBoardType } from '$lib/shared/schemas'
	import TextLoader from './TextLoader.svelte'

	type Props = {
		board: LeaderBoardType | null
		status: string
	}

	let { board, status }: Props = $props()
</script>

<section>
	<h2>Leaderboard</h2>
	{#if board}
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
			{status}
		</div>
	{:else}
		<TextLoader />
	{/if}
</section>

<style>
	table {
		border-collapse: collapse;
		width: 100%;
		border: 1px solid #222;
		margin-bottom: 1rem;
	}

	thead {
		background-color: #222;
	}

	:is(td, th) {
		padding: 0.4rem 0.8rem;
		text-align: left;
		white-space: nowrap;
	}

	tr:nth-child(even) {
		background-color: #111;
	}
</style>
