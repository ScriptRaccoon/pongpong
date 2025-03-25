export const prerender = false

import { get_leaderboard } from '$lib/server/scores'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	try {
		const board = await get_leaderboard()
		return { board }
	} catch (error) {
		console.error(error)
		return { board: null }
	}
}
