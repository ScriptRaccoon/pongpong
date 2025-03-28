import { LEADERBOARD_SIZE } from '$lib/shared/config'
import { ScoreListSchema, type ScoreList } from '$lib/shared/schemas'

export class ScoreClient {
	private static API_URL = '/api/scores'

	public static async fetch_scores(
		show_all_scores: boolean,
	): Promise<ScoreList | null> {
		try {
			const url = show_all_scores
				? ScoreClient.API_URL
				: `${ScoreClient.API_URL}?limit=${LEADERBOARD_SIZE}`

			const res = await fetch(url)

			if (!res.ok) {
				throw new Error("Couldn't fetch scores")
			}

			const res_json = await res.json()
			return ScoreListSchema.parse(res_json.scores)
		} catch (err) {
			console.error(err)
			return null
		}
	}

	public static async submit_score(
		name: string,
		score: number,
	): Promise<{ success: boolean; id: null | number }> {
		try {
			const res = await fetch(ScoreClient.API_URL, {
				method: 'POST',
				body: JSON.stringify({ name, score }),
				headers: { 'Content-Type': 'application/json' },
			})
			const res_json = await res.json()
			return { success: res.ok, id: res_json?.id ?? null }
		} catch (err) {
			console.error(err)
			return { success: false, id: null }
		}
	}
}
