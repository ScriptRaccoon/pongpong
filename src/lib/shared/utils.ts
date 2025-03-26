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

	const minimal_score = Math.min(...leaderboard.map((score) => score.score))

	return score > minimal_score
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
	return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export function rotate(x: number, y: number, angle: number) {
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)
	return [x * cos - y * sin, x * sin + y * cos]
}
