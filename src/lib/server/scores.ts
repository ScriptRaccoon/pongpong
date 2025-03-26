import { type LeaderBoardType, LeaderBoardSchema } from '$lib/shared/schemas'
import { MAX_LEADERBOARD_SIZE } from '$lib/shared/config'
import { turso } from './turso'
import { is_score_good_enough } from '$lib/shared/utils'

export async function get_leaderboard(): Promise<LeaderBoardType> {
	const { rows } = await turso.execute('SELECT * FROM leaderboard ORDER BY score DESC')
	return LeaderBoardSchema.parse(rows)
}

export async function handle_new_score(
	name: string,
	score: number,
): Promise<{ message: string }> {
	const leaderboard = await get_leaderboard()

	if (!is_score_good_enough(score, leaderboard)) {
		return { message: 'Score is not sufficient for the leaderboard' }
	}

	await add_score(name, score)

	if (leaderboard.length >= MAX_LEADERBOARD_SIZE) {
		await remove_worst_from_leaderboard(leaderboard)
	}

	return { message: 'Score has been added to the loaderboard' }
}

export async function clear_leaderboard(): Promise<void> {
	await turso.execute('DELETE FROM leaderboard')
}

async function add_score(name: string, score: number) {
	await turso.execute({
		sql: 'INSERT INTO leaderboard (name, score) VALUES (:name, :score)',
		args: { name, score },
	})
}

async function remove_worst_from_leaderboard(
	leaderboard: LeaderBoardType,
): Promise<void> {
	const worst = leaderboard.reduce((acc, curr) => (curr.score < acc.score ? curr : acc))
	if (!worst) return

	await turso.execute({
		sql: 'DELETE FROM leaderboard WHERE id = :id',
		args: { id: worst.id },
	})
}
