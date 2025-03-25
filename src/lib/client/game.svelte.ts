import { CANVAS_WIDTH } from '$lib/shared/config'
import { clear_canvas } from '$lib/shared/utils'
import { Ball } from './ball'
import { Deviator } from './deviator'
import { Player } from './player'

export class Game {
	public score = $state(0)
	public playing = $state(false)
	public ball: Ball
	public player_left: Player
	public player_right: Player
	public gameover_callback?: () => void
	public deviators: Deviator[] = []

	constructor() {
		this.ball = new Ball()
		this.player_left = new Player(50)
		this.player_right = new Player(CANVAS_WIDTH - 50 - 20)
	}

	update() {
		this.player_left.update()
		this.player_right.update()
		this.deviators.forEach((deviator) => {
			deviator.handle_collison(this.ball)
		})
		const action = this.ball.update(this.player_left, this.player_right)
		if (action === 'collision') this.handle_collision()
		else if (action === 'gameover') this.handle_gameover()
	}

	loop() {
		this.update()
		if (this.playing) requestAnimationFrame(() => this.loop())
	}

	handle_keydown(key: string) {
		if (!this.playing) return
		const acting_player = this.ball.vx < 0 ? this.player_left : this.player_right
		if (key === 'ArrowUp') {
			acting_player.move_up()
		} else if (key === 'ArrowDown') {
			acting_player.move_down()
		}
	}

	handle_start() {
		this.score = 0
		this.ball.reset()
		this.player_left.reset()
		this.player_right.reset()
		this.deviators = []
		this.playing = true
		this.loop()
	}

	handle_collision() {
		this.score++
		if (Math.random() < 0.1) {
			this.deviators.push(new Deviator())
		}
	}

	handle_gameover() {
		this.playing = false
		this.gameover_callback?.()
	}
}

export class GameClient extends Game {
	constructor(private ctx: CanvasRenderingContext2D) {
		super()
	}

	draw() {
		clear_canvas(this.ctx)
		this.deviators.forEach((deviator) => deviator.draw(this.ctx))
		this.player_left.draw(this.ctx)
		this.player_right.draw(this.ctx)
		this.ball.draw(this.ctx)
	}

	loop() {
		this.update()
		this.draw()
		if (this.playing) requestAnimationFrame(() => this.loop())
	}
}
