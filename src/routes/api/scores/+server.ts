import { ScoreService } from '$lib/server/ScoreService'
import { games } from '$lib/server/servergame'
import { turso } from '$lib/server/turso'
import { PostRequestSchema } from '$lib/shared/schemas'
import type { RequestHandler } from '@sveltejs/kit'
import { error, json } from '@sveltejs/kit'

const score_service = new ScoreService(turso)

export const GET: RequestHandler = async (event) => {
	try {
		const limit_param = event.url.searchParams.get('limit')
		const limit = Number(limit_param)

		if (limit_param && Number.isInteger(limit) && limit >= 0) {
			const scores = await score_service.get_best_scores(limit)
			return json({ scores })
		} else {
			const scores = await score_service.get_all_scores()
			return json({ scores })
		}
	} catch (err) {
		console.error(err)
		return error(500, 'Internal server error')
	}
}

export const POST: RequestHandler = async (event) => {
	const body = await event.request.json()
	const result = PostRequestSchema.safeParse(body)

	if (result.error) {
		const message = result.error.errors.map((error) => error.message).join(', ')
		return error(400, message)
	}

	const { name, score } = result.data

	const game_id = event.cookies.get('game_id')
	if (!game_id) return error(400, 'Missing game id')

	const game = games[game_id]
	if (!game) return error(404, 'Game not found')

	const actual_score = game.score

	if (actual_score !== score) {
		game.finish()
		return error(400, 'Score mismatch! Cheating detected!')
	}

	try {
		await score_service.submit_score(name, score)
		game.finish()
		return json({ message: 'Score has been added' })
	} catch (err) {
		console.error(err)
		return error(500, 'Internal server error')
	}
}
