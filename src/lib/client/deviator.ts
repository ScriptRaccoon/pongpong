import { CANVAS_WIDTH } from '$lib/shared/config'
import { distance, rotate } from '$lib/shared/utils'
import type { Ball } from './ball'

export class Deviator {
	private static COLLISION_TIMEOUT = 1000
	private r = 6
	private x = Math.random() * CANVAS_WIDTH
	private y = Math.random() * CANVAS_WIDTH
	private angle = Math.random() * Math.PI * 2
	private active_collisions: Ball[] = []

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = 'skyblue'
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
		ctx.fill()
		ctx.closePath()
	}

	public handle_collison(ball: Ball): void {
		if (this.active_collisions.includes(ball)) return

		const collides = distance(this.x, this.y, ball.x, ball.y) < this.r + ball.r
		if (!collides) return

		this.active_collisions.push(ball)
		this.deviate(ball)
		this.grow()

		setTimeout(() => {
			this.active_collisions = this.active_collisions.filter((b) => b !== ball)
		}, Deviator.COLLISION_TIMEOUT)
	}

	private deviate(ball: Ball): void {
		const vel = rotate(ball.vx, ball.vy, this.angle)
		ball.vx = vel[0]
		ball.vy = vel[1]
	}

	private grow(): void {
		this.r++
	}
}
