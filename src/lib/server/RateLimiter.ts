export class RateLimiter {
	private timestamps: number[] = []

	constructor(
		private max_hits: number,
		private interval: number, // in ms
	) {}

	public allow(): boolean {
		const now = Date.now()

		this.timestamps = this.timestamps.filter((t) => now - t <= this.interval)

		if (this.timestamps.length < this.max_hits) {
			this.timestamps.push(now)
			return true
		}

		return false
	}
}
