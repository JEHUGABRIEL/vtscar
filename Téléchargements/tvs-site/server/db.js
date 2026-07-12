import { neon } from '@neondatabase/serverless'
import 'dotenv/config'

if (!process.env.DATABASE_URL) {
  console.warn(
    '[db] DATABASE_URL manquant — copiez server/.env.example vers server/.env et renseignez votre chaîne de connexion Neon.'
  )
}

// `sql` est une fonction tag template : sql`SELECT * FROM products WHERE id = ${id}`
export const sql = neon(process.env.DATABASE_URL)
