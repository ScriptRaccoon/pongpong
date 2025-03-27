import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { games, ServerGame } from '$lib/server/ServerGame'

export const POST: RequestHandler = async (event) => {
	const game = new ServerGame()
	games[game.id] = game
	event.cookies.set('game_id', game.id, { path: '/' })
	return new Response('game created')
}

export const PATCH: RequestHandler = async (event) => {
	const game_id = event.cookies.get('game_id')
	if (!game_id) return error(400, 'Missing game id')
	const game = games[game_id]
	if (!game) return error(404, 'Game not found')

	const action_type = event.url.searchParams.get('action') ?? ''
	const { error: action_error, status } = game.add_action(action_type)

	if (action_error) return error(status, action_error)
	return json({ message: 'Action added' })
}

export const GET: RequestHandler = async (event) => {
	const game_id = event.cookies.get('game_id')
	if (!game_id) return error(400, 'Missing game id')
	const game = games[game_id]
	if (!game) return error(404, 'Game not found')
	return json({ score: game.score })
}
