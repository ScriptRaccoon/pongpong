import { CANVAS_WIDTH } from '$lib/shared/config'
import { distance } from '$lib/shared/utils'
import type { Ball } from './ball'

export class Accelerator {
	private r = 4
	private x = Math.random() * CANVAS_WIDTH
	private y = Math.random() * CANVAS_WIDTH

	public draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = 'orangered'
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
		ctx.fill()
		ctx.closePath()
	}

	public is_colliding(ball: Ball): boolean {
		const collides = distance(this.x, this.y, ball.x, ball.y) < this.r + ball.r
		if (!collides) return false
		ball.accelerate()
		return true
	}
}
