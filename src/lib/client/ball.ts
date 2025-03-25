import { CANVAS_HEIGHT, CANVAS_WIDTH } from '$lib/shared/config'
import { Player } from './player'

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
		this.vx = 2 + Math.random()
		this.vy = 2 * (Math.random() - 0.5)
	}

	update(player_left: Player, player_right: Player): UpdateAction {
		this.x += this.vx
		this.y += this.vy

		if (this.x < 0 || this.x > CANVAS_WIDTH) {
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

		const collides_with_left_player =
			this.x - this.r <= player_left.x + Player.size.x &&
			this.vx < 0 &&
			this.y >= player_left.y &&
			this.y <= player_left.y + Player.size.y

		if (collides_with_left_player) {
			this.vx = -this.vx
			this.x = player_left.x + Player.size.x + this.r
			return 'collision'
		}

		const collides_with_right_player =
			this.x + this.r >= player_right.x &&
			this.vx > 0 &&
			this.y >= player_right.y &&
			this.y <= player_right.y + Player.size.y

		if (collides_with_right_player) {
			this.vx = -this.vx
			this.x = player_right.x - this.r
			return 'collision'
		}

		return null
	}

	accelerate() {
		this.vx *= 1.125
		this.vy *= 1.125
	}
}
