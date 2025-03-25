import { MAX_LEADERBOARD_SIZE } from './config'
import type { LeaderBoardType } from './schemas'

export function clear_canvas(ctx: CanvasRenderingContext2D) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function is_score_good_enough(
	score: number,
	leaderboard: LeaderBoardType,
): boolean {
	if (leaderboard.length < MAX_LEADERBOARD_SIZE) {
		return true
	}

	const minimal_score = leaderboard.length
		? Math.min(...leaderboard.map((score) => score.score))
		: 0

	return score > minimal_score
}
