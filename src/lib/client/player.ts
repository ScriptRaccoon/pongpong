import { CANVAS_HEIGHT } from '$lib/shared/config'

export class Player {
	private static MAX_VELOCITY = 7
	private static FRICTION = 0.9
	public static SIZE = { x: 20, y: 100 }

	constructor(
		public readonly x: number,
		public y: number = 0,
		public vy: number = 0,
	) {
		this.reset()
	}

	public draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = 'white'
		ctx.fillRect(this.x, this.y, Player.SIZE.x, Player.SIZE.y)
	}

	public get left() {
		return this.x
	}

	public get right() {
		return this.x + Player.SIZE.x
	}

	public get top() {
		return this.y
	}

	private set top(value: number) {
		this.y = value
	}

	public get bottom() {
		return this.y + Player.SIZE.y
	}

	private set bottom(value: number) {
		this.y = value - Player.SIZE.y
	}

	public update() {
		this.y += this.vy
		this.vy *= Player.FRICTION

		if (Math.abs(this.vy) < 0.01) {
			this.vy = 0
		}

		if (this.top < 0) {
			this.top = 0
			this.vy = 0
		}

		if (this.bottom > CANVAS_HEIGHT) {
			this.bottom = CANVAS_HEIGHT
			this.vy = 0
		}
	}

	public move_down() {
		this.vy = Player.MAX_VELOCITY
	}

	public move_up() {
		this.vy = -Player.MAX_VELOCITY
	}

	public reset() {
		this.y = CANVAS_HEIGHT / 2 - Player.SIZE.y / 2
		this.vy = 0
	}
}
