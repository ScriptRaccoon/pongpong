import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '$env/static/private'
import { createClient } from '@libsql/client'

export const turso = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN,
})
