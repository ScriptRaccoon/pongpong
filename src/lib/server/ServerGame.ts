import { RateLimiter } from './RateLimiter'

export const GAME_ACTION_TYPE = ['start', 'hit', 'finish'] as const

type GameActionType = (typeof GAME_ACTION_TYPE)[number]

type GameActionEntry = {
	type: GameActionType
	timestamp: Date
}

const is_valid_action_type = (data: string): data is GameActionType =>
	GAME_ACTION_TYPE.includes(data as GameActionType)

export class ServerGame {
	public readonly id = crypto.randomUUID()
	public score = 0
	private actions: GameActionEntry[] = []
	private hit_limiter = new RateLimiter(10, 2000) // max 10 hits in 2 seconds

	constructor() {
		this.add_action('start')
	}

	public add_action(action_type: string): {
		error: string | null
		status: number
	} {
		if (!is_valid_action_type(action_type)) {
			return { error: 'Invalid action type', status: 400 }
		}

		if (action_type === 'hit') {
			if (!this.hit_limiter.allow()) {
				return { error: 'Too many hits in a short time interval', status: 429 }
			}
			this.score++
		}

		this.actions.push({ type: action_type, timestamp: new Date() })

		return { error: null, status: 201 }
	}

	public finish() {
		this.add_action('finish')
		delete games[this.id]
	}
}

export const games: Record<string, ServerGame | undefined> = {}
