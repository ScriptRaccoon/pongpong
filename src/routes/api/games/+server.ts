import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { create_game, get_game } from '$lib/server/utils'

export const POST: RequestHandler = async (event) => {
	create_game(event.cookies)
	return new Response('game created')
}

export const PATCH: RequestHandler = async (event) => {
	const game = get_game(event.cookies)
	if (!game) return error(400, 'Missing game')

	const action = event.url.searchParams.get('action') ?? ''
	const { error: action_error, status } = game.add_action(action)

	if (action_error) return error(status, action_error)
	return json({ message: 'Action added' })
}

export const GET: RequestHandler = async (event) => {
	const game = get_game(event.cookies)
	if (!game) return error(400, 'Missing game')

	return json({ score: game.score })
}
