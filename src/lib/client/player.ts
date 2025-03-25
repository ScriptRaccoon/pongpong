import { CANVAS_HEIGHT } from '$lib/shared/config'

export class Player {
	static MAX_VELOCITY = 7
	static FRICTION = 0.9
	static size = { x: 20, y: 100 }

	constructor(
		public readonly x: number,
		public y: number = CANVAS_HEIGHT / 2 - Player.size.y / 2,
		public vy: number = 0,
	) {}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = 'white'
		ctx.fillRect(this.x, this.y, Player.size.x, Player.size.y)
	}

	update() {
		this.y += this.vy
		this.vy *= Player.FRICTION

		if (Math.abs(this.vy) < 0.01) {
			this.vy = 0
		}

		if (this.y < 0) {
			this.y = 0
			this.vy = 0
		}

		if (this.y > CANVAS_HEIGHT - Player.size.y) {
			this.y = CANVAS_HEIGHT - Player.size.y
			this.vy = 0
		}
	}

	move_down() {
		this.vy = Player.MAX_VELOCITY
	}

	move_up() {
		this.vy = -Player.MAX_VELOCITY
	}

	reset() {
		this.y = CANVAS_HEIGHT / 2 - Player.size.y / 2
		this.vy = 0
	}
}
