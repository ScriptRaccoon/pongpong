import type { Cookies } from '@sveltejs/kit'
import { games, ServerGame } from './ServerGame'

const GAME_COOKIE_NAME = 'game_id'

export function get_game(cookies: Cookies): ServerGame | null {
	const game_id = cookies.get(GAME_COOKIE_NAME)
	if (!game_id) return null
	const game = games[game_id]
	if (!game) return null
	return game
}

export function create_game(cookies: Cookies): void {
	const game = new ServerGame()
	games[game.id] = game
	cookies.set(GAME_COOKIE_NAME, game.id, { path: '/' })
}
