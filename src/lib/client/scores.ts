import { API_URL, LEADERBOARD_SIZE } from '$lib/shared/config'
import { ScoreListSchema, type ScoreList } from '$lib/shared/schemas'

export async function fetch_scores(show_all_scores: boolean): Promise<ScoreList | null> {
	try {
		const url = show_all_scores ? API_URL : `${API_URL}?limit=${LEADERBOARD_SIZE}`

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

export async function submit_score(
	name: string,
	score: number,
): Promise<{ success: boolean }> {
	try {
		const res = await fetch(API_URL, {
			method: 'POST',
			body: JSON.stringify({ name, score }),
			headers: { 'Content-Type': 'application/json' },
		})
		return { success: res.ok }
	} catch (err) {
		console.error(err)
		return { success: false }
	}
}
