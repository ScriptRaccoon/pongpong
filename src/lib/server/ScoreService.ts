import { type LeaderBoardType, LeaderBoardSchema } from '$lib/shared/schemas'
import { MAX_LEADERBOARD_SIZE } from '$lib/shared/config'
import { is_score_good_enough } from '$lib/shared/utils'

interface Database {
	execute: (sql: {
		sql: string
		args?: Record<string, any>
	}) => Promise<{ rows: unknown[] }>
}

export class ScoreService {
	constructor(private db: Database) {}

	public async get_leaderboard(): Promise<LeaderBoardType> {
		const { rows } = await this.db.execute({
			sql: 'SELECT * FROM leaderboard ORDER BY score DESC',
		})
		return LeaderBoardSchema.parse(rows)
	}

	public async clear_leaderboard(): Promise<void> {
		await this.db.execute({ sql: 'DELETE FROM leaderboard' })
	}

	public async submit_score(name: string, score: number): Promise<{ message: string }> {
		const leaderboard = await this.get_leaderboard()

		if (!is_score_good_enough(score, leaderboard)) {
			return { message: 'Score is not sufficient for the leaderboard' }
		}

		await this.add_score(name, score)

		if (leaderboard.length >= MAX_LEADERBOARD_SIZE) {
			await this.remove_worst_from_leaderboard(leaderboard)
		}

		return { message: 'Score has been added to the loaderboard' }
	}

	private async add_score(name: string, score: number) {
		await this.db.execute({
			sql: 'INSERT INTO leaderboard (name, score) VALUES (:name, :score)',
			args: { name, score },
		})
	}

	private async remove_worst_from_leaderboard(
		leaderboard: LeaderBoardType,
	): Promise<void> {
		const worst = leaderboard.reduce((acc, curr) =>
			curr.score < acc.score ? curr : acc,
		)
		if (!worst) return

		await this.db.execute({
			sql: 'DELETE FROM leaderboard WHERE id = :id',
			args: { id: worst.id },
		})
	}
}
