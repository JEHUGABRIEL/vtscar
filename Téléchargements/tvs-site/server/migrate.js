import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import 'dotenv/config'
import { sql } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function migrate() {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')
  // @neondatabase/serverless exécute une requête à la fois : on découpe sur les ';'
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)

  for (const statement of statements) {
    await sql(statement)
  }
  console.log(`[migrate] ${statements.length} instructions exécutées avec succès.`)
}

migrate().catch((err) => {
  console.error('[migrate] Échec de la migration :', err)
  process.exit(1)
})
