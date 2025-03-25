import { get_leaderboard, handle_new_score } from '$lib/server/scores'
import { PostRequestSchema } from '$lib/shared/schemas'
import type { RequestHandler } from '@sveltejs/kit'
import { error, json } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	try {
		const board = await get_leaderboard()
		return json({ board })
	} catch (err) {
		console.error(err)
		return error(500, 'Internal server error')
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json()
	const name: unknown = body?.name
	const score: unknown = body?.score

	const result = PostRequestSchema.safeParse({ name, score })

	if (result.error) {
		const messages = result.error.errors.map((error) => error.message).join(', ')
		return error(400, messages)
	}

	const { data } = result

	try {
		const { message } = await handle_new_score(data.name, data.score)
		return json({ message })
	} catch (err) {
		console.error(err)
		return error(500, 'Internal server error')
	}
}
