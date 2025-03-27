export function clear_canvas(ctx: CanvasRenderingContext2D) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function distance(x1: number, y1: number, x2: number, y2: number) {
	return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

interface BallLike {
	x: number
	y: number
	r: number
}

export function collides(ball1: BallLike, ball2: BallLike) {
	return distance(ball1.x, ball1.y, ball2.x, ball2.y) < ball1.r + ball2.r
}

export function rotate(x: number, y: number, angle: number) {
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)
	return [x * cos - y * sin, x * sin + y * cos]
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
