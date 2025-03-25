import { clear_canvas } from '$lib/shared/utils'
import { Ball } from './ball'
import { Player } from './player'

export class Game {
	public score = $state(0)
	public playing = $state(false)
	public ctx: CanvasRenderingContext2D
	public ball: Ball
	public player: Player
	public gameover_callback?: () => void

	constructor(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext('2d')
		if (!ctx) throw new Error('Canvas context not found')
		this.ctx = ctx
		this.ball = new Ball()
		this.player = new Player()
	}

	loop() {
		const ctx = this.ctx
		clear_canvas(ctx)
		this.player.update(ctx)
		const action = this.ball.update(ctx, this.player)
		if (action === 'collision') this.handle_collision()
		else if (action === 'gameover') this.handle_gameover()
		this.player.draw(ctx)
		this.ball.draw(ctx)
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
		this.ball.reset(this.ctx)
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
