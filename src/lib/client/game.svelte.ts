import { CANVAS_WIDTH } from '$lib/shared/config'
import { clear_canvas } from '$lib/shared/utils'
import { Accelerator } from './accelerator'
import { Ball } from './ball'
import { Deviator } from './deviator'
import { Player } from './player'

export const STATUS = {
	INITIAL: 'initial',
	PLAYING: 'playing',
	PAUSED: 'paused',
	GAMEOVER: 'gameover',
} as const

export type GameStatus = (typeof STATUS)[keyof typeof STATUS]

export class Game {
	private static API_URL = '/api/games'
	public score = $state(0)
	public status = $state<GameStatus>(STATUS.INITIAL)
	private ctx: CanvasRenderingContext2D
	private ball: Ball = new Ball()
	private player_left: Player = new Player(50)
	private player_right: Player = new Player(CANVAS_WIDTH - 50 - this.player_left.size.x)
	private gameover_callback?: () => void
	private deviators: Deviator[] = []
	private accelerators: Accelerator[] = []
	public error_message: string | null = $state(null)

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
			accelerator.handle_collision(this.ball)
			if (!accelerator.active) {
				this.accelerators = this.accelerators.filter((a) => a !== accelerator)
			}
		})
		const action = this.ball.update(this.player_left, this.player_right)
		if (action === 'collision') this.handle_collision()
		else if (action === 'gameover') this.handle_gameover()
	}

	get entities() {
		return [
			this.player_left,
			this.player_right,
			this.ball,
			...this.deviators,
			...this.accelerators,
		]
	}

	public draw() {
		clear_canvas(this.ctx)
		this.entities.forEach((entity) => entity.draw(this.ctx))
	}

	public loop() {
		this.update()
		this.draw()
		if (this.status === STATUS.PLAYING) requestAnimationFrame(() => this.loop())
	}

	public handle_keydown(key: string) {
		const during_game =
			this.status === STATUS.PLAYING || this.status === STATUS.PAUSED
		if (during_game && key === 'p') {
			this.toggle_pause()
		}

		if (this.status != STATUS.PLAYING) return

		const acting_player = this.ball.vx < 0 ? this.player_left : this.player_right

		if (key === 'ArrowUp') {
			acting_player.move_up()
		} else if (key === 'ArrowDown') {
			acting_player.move_down()
		}
	}

	private async create_servergame(): Promise<{ success: boolean }> {
		try {
			const res = await fetch(Game.API_URL, { method: 'POST' })
			return { success: res.ok }
		} catch (err) {
			console.error(err)
			return { success: false }
		}
	}

	public async start() {
		const { success } = await this.create_servergame()
		if (!success) {
			this.error_message = 'Failed to create game'
			return
		}

		this.score = 0
		this.ball.reset()
		this.player_left.reset()
		this.player_right.reset()
		this.deviators = []
		this.accelerators = []
		this.status = STATUS.PLAYING
		this.error_message = null
		this.loop()
	}

	private async handle_collision() {
		this.score++
		if (Math.random() < 0.1) {
			this.deviators.push(new Deviator())
		}
		if (Math.random() < 0.05) {
			this.accelerators.push(new Accelerator())
		}
		this.send_hit_to_server()
	}

	private async send_hit_to_server() {
		try {
			const res = await fetch(`${Game.API_URL}?action=hit`, { method: 'PATCH' })

			if (!res.ok) {
				this.error_message = (await res.json())?.message ?? 'Failed to send hit'
				this.status = STATUS.GAMEOVER
			}
		} catch (err) {
			console.error(err)
			this.error_message = 'Failed to send hit'
			this.status = STATUS.GAMEOVER
		}
	}

	private async handle_gameover() {
		this.status = STATUS.GAMEOVER

		try {
			const res = await fetch(Game.API_URL, { method: 'GET' })
			const res_json = await res.json()

			if (!res.ok) {
				this.error_message = res_json?.message ?? 'Failed to get score'
				return
			}

			this.score = res_json.score
			this.gameover_callback?.()
		} catch (err) {
			console.error(err)
			this.error_message = 'Failed to get score'
		}
	}

	public ongameover(callback: () => void) {
		this.gameover_callback = callback
	}

	public toggle_pause() {
		if (this.status === STATUS.GAMEOVER) return
		this.status = this.status === STATUS.PLAYING ? STATUS.PAUSED : STATUS.PLAYING
		if (this.status === STATUS.PLAYING) this.loop()
	}
}
