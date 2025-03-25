import { CANVAS_HEIGHT, CANVAS_WIDTH } from '$lib/shared/config'
import { type Player } from './player'

type UpdateAction = 'gameover' | 'collision' | null

export class Ball {
	constructor(
		public x: number = 0,
		public y: number = 0,
		public vx: number = 0,
		public vy: number = 0,
		public r: number = 10,
	) {
		this.reset()
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = 'yellow'
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
		ctx.fill()
		ctx.closePath()
	}

	reset() {
		this.x = CANVAS_WIDTH / 2
		this.y = CANVAS_HEIGHT / 2
		this.vx = 3 + Math.random()
		this.vy = 2 * (Math.random() - 0.5)
	}

	update(player: Player): UpdateAction {
		this.x += this.vx
		this.y += this.vy

		if (this.x < 0) {
			this.vx = 0
			this.vy = 0
			return 'gameover'
		}

		if (this.y - this.r <= 0) {
			this.y = this.r
			this.vy = -this.vy
		} else if (this.y + this.r >= CANVAS_HEIGHT) {
			this.y = CANVAS_HEIGHT - this.r
			this.vy = -this.vy
		}

		if (this.x + this.r >= CANVAS_WIDTH) {
			this.x = CANVAS_WIDTH - this.r
			this.vx = -this.vx
		}

		const collides_with_player =
			this.x - this.r <= player.x + player.size.x &&
			this.vx < 0 &&
			this.y >= player.y &&
			this.y <= player.y + player.size.y

		if (collides_with_player) {
			this.vx = -this.vx
			this.x = player.x + player.size.x + this.r
			return 'collision'
		}

		return null
	}
}
