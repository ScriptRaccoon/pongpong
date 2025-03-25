import { turso } from './turso'

const sql = `
CREATE TABLE IF NOT EXISTS
    leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        score INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

export async function seed() {
	await turso.execute(sql)
	console.info('seeding done')
}
