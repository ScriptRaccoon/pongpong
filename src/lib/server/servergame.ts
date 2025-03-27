export const GAME_ACTION_TYPE = ['start', 'hit'] as const

type GameActionType = (typeof GAME_ACTION_TYPE)[number]

type GameActionEntry = {
	type: GameActionType
	timestamp: Date
}

export const is_valid_action_type = (data: string): data is GameActionType =>
	GAME_ACTION_TYPE.includes(data as GameActionType)

export class ServerGame {
	public readonly id = crypto.randomUUID()
	public score = 0
	private actions: GameActionEntry[] = []

	constructor() {
		this.add_action('start')
	}

	public add_action(action_type: GameActionType) {
		if (action_type === 'hit') {
			this.score++
		}
		const action = {
			type: action_type,
			timestamp: new Date(),
		}
		this.actions.push(action)
	}

	public finish() {
		delete games[this.id]
	}
}

export const games: Record<string, ServerGame | undefined> = {}
