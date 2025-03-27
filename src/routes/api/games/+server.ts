import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { games, is_valid_action_type, ServerGame } from '$lib/server/servergame'

export const POST: RequestHandler = async (event) => {
	const game = new ServerGame()
	games[game.id] = game
	event.cookies.set('game_id', game.id, { path: '/' })
	return new Response('game created')
}

export const PATCH: RequestHandler = async (event) => {
	const game_id = event.cookies.get('game_id')
	const action_type = event.url.searchParams.get('action')
	if (!game_id) return error(400, 'Missing game id')
	const game = games[game_id]
	if (!game) return error(404, 'Game not found')
	if (!action_type) return error(400, 'Missing action type')
	if (!is_valid_action_type(action_type)) return error(400, 'Invalid action type')
	game.add_action(action_type)
	return new Response('action added')
}

export const GET: RequestHandler = async (event) => {
	const game_id = event.cookies.get('game_id')
	if (!game_id) return error(400, 'Missing game id')
	const game = games[game_id]
	if (!game) return error(404, 'Game not found')
	return json({ score: game.score })
}
