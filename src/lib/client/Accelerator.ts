import { CANVAS_WIDTH } from '$lib/shared/config'
import { collides } from '$lib/shared/utils'
import type { Ball } from './Ball'

export class Accelerator {
	public x = Math.random() * CANVAS_WIDTH
	public y = Math.random() * CANVAS_WIDTH
	public r = 4

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = 'orangered'
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
		ctx.fill()
		ctx.closePath()
	}

	public handle_collision(ball: Ball): { collided: boolean } {
		if (collides(this, ball)) {
			ball.accelerate()
			return { collided: true }
		}
		return { collided: false }
	}
}
