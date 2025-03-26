import { type ScoreList, ScoreListSchema } from '$lib/shared/schemas'

interface Database {
	execute: (sql: {
		sql: string
		args?: Record<string, any>
	}) => Promise<{ rows: unknown[] }>
}

export class ScoreService {
	constructor(private db: Database) {}

	public async get_all_scores(): Promise<ScoreList> {
		const { rows } = await this.db.execute({
			sql: 'SELECT * FROM scores ORDER BY score DESC',
		})
		return ScoreListSchema.parse(rows)
	}

	public async get_best_scores(limit: number): Promise<ScoreList> {
		const { rows } = await this.db.execute({
			sql: 'SELECT * FROM scores ORDER BY score DESC LIMIT :limit',
			args: { limit },
		})
		return ScoreListSchema.parse(rows)
	}

	public async clear_scores(): Promise<void> {
		await this.db.execute({ sql: 'DELETE FROM scores' })
	}

	public async submit_score(name: string, score: number) {
		await this.db.execute({
			sql: 'INSERT INTO scores (name, score) VALUES (:name, :score)',
			args: { name, score },
		})
	}
}
