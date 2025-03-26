import { CANVAS_WIDTH } from '$lib/shared/config'
import { clear_canvas } from '$lib/shared/utils'
import { Accelerator } from './accelerator'
import { Ball } from './ball'
import { Deviator } from './deviator'
import { Player } from './player'

export class Game {
	public score = $state(0)
	public playing = $state(false)
	public gameover = $state(false)
	public paused = $state(false)
	private ctx: CanvasRenderingContext2D
	private ball: Ball = new Ball()
	private player_left: Player = new Player(50)
	private player_right: Player = new Player(CANVAS_WIDTH - 50 - Player.SIZE.x)
	private gameover_callback?: () => void
	private deviators: Deviator[] = []
	private accelerators: Accelerator[] = []

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx
	}

	public update() {
		this.player_left.update()
		this.player_right.update()
		this.deviators.forEach((deviator) => {
			deviator.handle_collison(this.ball)
		})
		this.accelerators.forEach((accelerator) => {
			const collides = accelerator.is_colliding(this.ball)
			if (collides) {
				this.accelerators = this.accelerators.filter((a) => a !== accelerator)
			}
		})
		const action = this.ball.update(this.player_left, this.player_right)
		if (action === 'collision') this.handle_collision()
		else if (action === 'gameover') this.handle_gameover()
	}

	public draw() {
		clear_canvas(this.ctx)
		this.deviators.forEach((deviator) => deviator.draw(this.ctx))
		this.accelerators.forEach((accelerator) => accelerator.draw(this.ctx))
		this.player_left.draw(this.ctx)
		this.player_right.draw(this.ctx)
		this.ball.draw(this.ctx)
	}

	public loop() {
		this.update()
		this.draw()
		if (this.playing && !this.paused) requestAnimationFrame(() => this.loop())
	}

	public handle_keydown(key: string) {
		if (!this.playing) return
		const acting_player = this.ball.vx < 0 ? this.player_left : this.player_right
		if (key === 'ArrowUp') {
			acting_player.move_up()
		} else if (key === 'ArrowDown') {
			acting_player.move_down()
		}
	}

	public handle_start() {
		this.score = 0
		this.ball.reset()
		this.player_left.reset()
		this.player_right.reset()
		this.deviators = []
		this.accelerators = []
		this.playing = true
		this.gameover = false
		this.loop()
	}

	private handle_collision() {
		this.score++
		if (Math.random() < 0.1) {
			this.deviators.push(new Deviator())
		}
		if (Math.random() < 0.05) {
			this.accelerators.push(new Accelerator())
		}
	}

	private handle_gameover() {
		this.playing = false
		this.gameover = true
		this.gameover_callback?.()
	}

	public on_gameover(callback: () => void) {
		this.gameover_callback = callback
	}

	public toggle_pause() {
		if (!this.playing) return
		this.paused = !this.paused
		if (!this.paused) this.loop()
	}
}
