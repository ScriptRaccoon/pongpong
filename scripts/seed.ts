import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
dotenv.config()

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL ?? ''
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN ?? ''

const turso = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN,
})

const sql = `
CREATE TABLE
    IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        score INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`

async function seed() {
	await turso.execute(sql)
	console.info('seeding done')
}

seed()
