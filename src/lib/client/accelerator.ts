import { CANVAS_WIDTH } from '$lib/shared/config'
import { distance } from '$lib/shared/utils'
import type { Ball } from './ball'

export class Accelerator {
	private r = 4
	private x = Math.random() * CANVAS_WIDTH
	private y = Math.random() * CANVAS_WIDTH
	public active = true

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = 'orangered'
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
		ctx.fill()
		ctx.closePath()
	}

	public handle_collision(ball: Ball): void {
		const collides = distance(this.x, this.y, ball.x, ball.y) < this.r + ball.r
		if (collides) {
			this.active = false
			ball.accelerate()
		}
	}
}
