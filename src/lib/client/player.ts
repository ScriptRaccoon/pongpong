export class Player {
	static MAX_VELOCITY = 7
	static FRICTION = 0.9

	constructor(
		public x: number = 50,
		public y: number = 0,
		public vy: number = 0,
		public size: { x: number; y: number } = { x: 20, y: 100 },
	) {}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = 'white'
		ctx.fillRect(this.x, this.y, this.size.x, this.size.y)
	}

	update(ctx: CanvasRenderingContext2D) {
		this.y += this.vy
		this.vy *= Player.FRICTION

		if (Math.abs(this.vy) < 0.01) {
			this.vy = 0
		}

		if (this.y < 0) {
			this.y = 0
			this.vy = 0
		}

		if (this.y > ctx.canvas.height - this.size.y) {
			this.y = ctx.canvas.height - this.size.y
			this.vy = 0
		}
	}

	move_down() {
		this.vy = Player.MAX_VELOCITY
	}

	move_up() {
		this.vy = -Player.MAX_VELOCITY
	}
}

export const player = new Player()
