import { type LeaderBoard, LeaderboardSchema } from '../shared/schemas'
import { MAX_LEADERBOARD_SIZE } from '../shared/config'
import { turso } from './turso'

export async function get_leaderboard(): Promise<LeaderBoard> {
	const sql = 'SELECT * FROM leaderboard ORDER BY score DESC'
	const { rows } = await turso.execute(sql)
	return LeaderboardSchema.parse(rows)
}

export async function handle_new_score(
	name: string,
	score: number,
): Promise<{ message: string }> {
	const leaderboard = await get_leaderboard()
	if (!is_score_good_enough(score, leaderboard)) {
		return { message: 'Score is not sufficient for the leaderboard' }
	}

	const { added } = await add_score(name, score)

	if (added && leaderboard.length >= MAX_LEADERBOARD_SIZE) {
		await remove_worst_from_leaderboard(leaderboard)
	}

	return { message: 'Score has been added to the loaderboard' }
}

export async function clear_leaderboard(): Promise<void> {
	await turso.execute('DELETE FROM leaderboard')
}

async function add_score(name: string, score: number): Promise<{ added: boolean }> {
	try {
		await turso.execute({
			sql: 'INSERT INTO leaderboard (name, score) VALUES (:name, :score)',
			args: { name, score },
		})
		return { added: true }
	} catch (error) {
		console.error(error)
		return { added: false }
	}
}

function is_score_good_enough(score: number, leaderboard: LeaderBoard): boolean {
	if (leaderboard.length < MAX_LEADERBOARD_SIZE) {
		return true
	}

	const minimal_score = leaderboard.length
		? Math.min(...leaderboard.map((score) => score.score))
		: 0

	return score > minimal_score
}

async function remove_worst_from_leaderboard(leaderboard: LeaderBoard): Promise<void> {
	const worst = leaderboard.reduce((acc, curr) => (curr.score < acc.score ? curr : acc))
	if (!worst) return

	await turso.execute({
		sql: 'DELETE FROM leaderboard WHERE id = :id',
		args: { id: worst.id },
	})
}
