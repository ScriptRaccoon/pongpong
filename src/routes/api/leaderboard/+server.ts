import { ScoreService } from '$lib/server/ScoreService'
import { turso } from '$lib/server/turso'
import { PostRequestSchema } from '$lib/shared/schemas'
import type { RequestHandler } from '@sveltejs/kit'
import { error, json } from '@sveltejs/kit'

const score_service = new ScoreService(turso)

export const GET: RequestHandler = async () => {
	try {
		const board = await score_service.get_leaderboard()
		return json({ board })
	} catch (err) {
		console.error(err)
		return error(500, 'Internal server error')
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json()
	const result = PostRequestSchema.safeParse(body)

	if (result.error) {
		const message = result.error.errors.map((error) => error.message).join(', ')
		return error(400, message)
	}

	try {
		const { message } = await score_service.submit_score(
			result.data.name,
			result.data.score,
		)
		return json({ message })
	} catch (err) {
		console.error(err)
		return error(500, 'Internal server error')
	}
}
