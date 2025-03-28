import { CANVAS_HEIGHT } from '$lib/shared/config'

export class Player {
	private static MAX_VELOCITY = 7
	private static FRICTION = 0.9
	private static VELOCITY_THRESHOLD = 0.1

	constructor(
		public x: number,
		public y: number = 0,
		public vy: number = 0,
		public size = { x: 20, y: 100 },
	) {
		this.reset()
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = 'white'
		ctx.fillRect(this.x, this.y, this.size.x, this.size.y)
	}

	public get left() {
		return this.x
	}

	public get right() {
		return this.x + this.size.x
	}

	public get top() {
		return this.y
	}

	private set top(value: number) {
		this.y = value
	}

	public get bottom() {
		return this.y + this.size.y
	}

	private set bottom(value: number) {
		this.y = value - this.size.y
	}

	public update(): void {
		this.y += this.vy
		this.vy *= Player.FRICTION

		if (Math.abs(this.vy) < Player.VELOCITY_THRESHOLD) {
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

	public move_down(): void {
		this.vy = Player.MAX_VELOCITY
	}

	public move_up(): void {
		this.vy = -Player.MAX_VELOCITY
	}

	public reset(): void {
		this.y = CANVAS_HEIGHT / 2 - this.size.y / 2
		this.vy = 0
	}
}
