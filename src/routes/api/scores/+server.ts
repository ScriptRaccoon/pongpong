import { ScoreService } from '$lib/server/ScoreService'
import { turso } from '$lib/server/turso'
import { get_game } from '$lib/server/utils'
import { PostRequestSchema } from '$lib/shared/schemas'
import type { RequestHandler } from '@sveltejs/kit'
import { error, json } from '@sveltejs/kit'

const score_service = new ScoreService(turso)

export const GET: RequestHandler = async (event) => {
	try {
		const limit = event.url.searchParams.has('limit')
			? Number(event.url.searchParams.get('limit'))
			: null

		const scores =
			limit !== null
				? await score_service.get_best_scores(limit)
				: await score_service.get_all_scores()

		return json({ scores })
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

	const game = get_game(event.cookies)
	if (!game) return error(400, 'Missing game')

	const actual_score = game.score

	if (actual_score !== score) {
		game.finish()
		return error(400, 'Score mismatch! Cheating detected!')
	}

	try {
		const id = await score_service.submit_score(name, score)
		game.finish()
		return json({ message: 'Score has been added', id })
	} catch (err) {
		console.error(err)
		return error(500, 'Internal server error')
	}
}
