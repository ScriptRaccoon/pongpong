import { clear_canvas } from '$lib/shared/utils'
import { Ball } from './ball'
import { Player } from './player'

export class Game {
	public score = $state(0)
	public playing = $state(false)
	public ball: Ball
	public player: Player
	public gameover_callback?: () => void

	constructor() {
		this.ball = new Ball()
		this.player = new Player()
	}

	update() {
		this.player.update()
		const action = this.ball.update(this.player)
		if (action === 'collision') this.handle_collision()
		else if (action === 'gameover') this.handle_gameover()
	}

	loop() {
		this.update()
		if (this.playing) requestAnimationFrame(() => this.loop())
	}

	handle_keydown(e: KeyboardEvent) {
		if (!this.playing) return
		if (e.key === 'ArrowUp') {
			this.player.move_up()
		} else if (e.key === 'ArrowDown') {
			this.player.move_down()
		}
	}

	handle_start() {
		this.score = 0
		this.ball.reset()
		this.playing = true
		this.loop()
	}

	handle_collision() {
		this.score++
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
		this.player.draw(this.ctx)
		this.ball.draw(this.ctx)
	}

	loop() {
		this.update()
		this.draw()
		if (this.playing) requestAnimationFrame(() => this.loop())
	}
}
