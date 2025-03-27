import { CANVAS_HEIGHT, CANVAS_WIDTH } from '$lib/shared/config'
import { Player } from './player'

type UpdateAction = 'gameover' | 'collision' | null

export class Ball {
	public x: number = 0
	public y: number = 0
	public vx: number = 0
	public vy: number = 0
	public r: number = 10

	constructor() {
		this.reset()
	}

	public get left() {
		return this.x - this.r
	}

	public get right() {
		return this.x + this.r
	}

	public get top() {
		return this.y - this.r
	}

	public get bottom() {
		return this.y + this.r
	}

	public draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = 'yellow'
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
		ctx.fill()
		ctx.closePath()
	}

	public reset() {
		this.x = CANVAS_WIDTH / 2
		this.y = CANVAS_HEIGHT / 2
		const angle = 0.5 * (Math.random() - 0.5) * Math.PI
		this.vx = 2 * Math.cos(angle)
		this.vy = 2 * Math.sin(angle)
	}

	public update(player_left: Player, player_right: Player): UpdateAction {
		if (this.vx === 0) {
			this.vx = 0.2 * (Math.random() - 0.5)
		}

		this.x += this.vx
		this.y += this.vy

		if (this.x < 0 || this.x > CANVAS_WIDTH) {
			this.vx = 0
			this.vy = 0
			return 'gameover'
		}

		if (this.top <= 0) {
			this.y = this.r
			this.vy = -this.vy
		} else if (this.bottom >= CANVAS_HEIGHT) {
			this.y = CANVAS_HEIGHT - this.r
			this.vy = -this.vy
		}

		const collides_with_left_player =
			this.left <= player_left.right &&
			this.x >= player_left.right &&
			this.vx < 0 &&
			this.y >= player_left.top &&
			this.y <= player_left.bottom

		if (collides_with_left_player) {
			this.vx = -this.vx
			this.x = player_left.right + this.r
			return 'collision'
		}

		const collides_with_right_player =
			this.right >= player_right.left &&
			this.x <= player_right.left &&
			this.vx > 0 &&
			this.y >= player_right.top &&
			this.y <= player_right.bottom

		if (collides_with_right_player) {
			this.vx = -this.vx
			this.x = player_right.x - this.r
			return 'collision'
		}

		return null
	}

	public accelerate() {
		this.vx *= 1.125
		this.vy *= 1.125
	}
}
